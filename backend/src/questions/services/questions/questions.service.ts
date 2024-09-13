import { BadRequestException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/questions/entities/category.model";
import { Distractor } from "src/questions/entities/distractor.model";
import { Question } from "src/questions/entities/question.model";
import {
  CreateQuestionParams,
  UpdateQuestionParams,
} from "src/questions/questions";
import { Repository } from "typeorm";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Distractor)
    private distractorRepository: Repository<Distractor>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async getQuestions(): Promise<Question[]> {
    const questionsQuery = this.questionRepository
      .createQueryBuilder("questions")
      .leftJoinAndSelect("questions.distractors", "distractors")
      .leftJoinAndSelect("questions.category", "category")
      .take(25);
    return questionsQuery.getMany();
  }
  async getCategoryOrCreateByName(
    categoryName: string,
    description?: string
  ): Promise<Category> {
    let category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (!category) {
      category = this.categoryRepository.create({
        name: categoryName,
        description: description,
      });
      await this.categoryRepository.save(category);
    } else {
      category.description = description;
      await this.categoryRepository.save(category);
    }
    return category;
  }
  async createQuestion(questionDetails: CreateQuestionParams) {
    if (questionDetails.category.some((category) => !category.name)) {
      throw new BadRequestException({
        message: "Category name is required",
      });
    }

    if (questionDetails.distractors.some((distractor) => !distractor.content)) {
      throw new BadRequestException({
        message: "Distractor content is required",
      });
    }

    const question = await this.questionRepository.findOne({
      where: {
        question: questionDetails.question,
        correctAnswer: questionDetails.correctAnswer,
        photo: questionDetails.photo,
      },
    });

    if (question) {
      throw new BadRequestException({
        message: "Question already exists",
      });
    }

    const categories = await Promise.all(
      questionDetails.category.map((category) =>
        this.getCategoryOrCreateByName(category.name)
      )
    );
    questionDetails.category = categories;

    questionDetails.distractors = await this.distractorRepository.save(
      questionDetails.distractors.map((distractor) =>
        this.distractorRepository.create(distractor)
      )
    );

    const newQuestion = this.questionRepository.save(
      this.questionRepository.create({
        ...questionDetails,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    return newQuestion;
  }

  async deleteQuestion(questionId: number) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ["distractors"],
    });

    if (!question) {
      throw new BadRequestException({
        message: "Question not found",
      });
    }
    if (question.distractors.length > 0) {
      await this.distractorRepository.remove(question.distractors);
    }

    return this.questionRepository.delete(questionId);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getQuestionsByCategory(category: Category): Promise<Question[]> {
    return this.questionRepository.find({
      where: { category: category },
      relations: ["distractors"],
    });
  }

  async patchQuestion(
    questionId: number,
    questionDetails: UpdateQuestionParams
  ) {
    let question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ["distractors", "category"],
    });

    if (!question) {
      throw new BadRequestException({
        message: "Question not found",
      });
    }

    if (questionDetails.category) {
      if (questionDetails.category.some((category) => !category.name)) {
        throw new BadRequestException({
          message: "Category name is required",
        });
      }
      if (questionDetails.category.length < 1) {
        throw new BadRequestException({
          message: "Question must have at least one category",
        });
      }
      const categories = await Promise.all(
        questionDetails.category.map((category) =>
          this.getCategoryOrCreateByName(category.name, category.description)
        )
      );
      question.category = categories;
    }
    delete questionDetails.category;

    if (questionDetails.distractors) {
      if (
        questionDetails.distractors.some((distractor) => !distractor.content)
      ) {
        throw new BadRequestException({
          message: "Distractor content is required",
        });
      }
      if (questionDetails.distractors.length != 3) {
        throw new BadRequestException({
          message: "Distractors must be 3",
        });
      }

      question.distractors = question.distractors.filter((distractor) =>
        questionDetails.distractors
          .map((distractor) => distractor.content)
          .includes(distractor.content)
      );

      let nonExistingDistractors = questionDetails.distractors.filter(
        (distractor) =>
          !question.distractors
            .map((distractor) => distractor.content)
            .includes(distractor.content)
      );

      if (
        nonExistingDistractors.length !=
        nonExistingDistractors.filter(
          (distractor, index, self) =>
            index === self.findIndex((t) => t.content === distractor.content)
        ).length
      ) {
        throw new BadRequestException({
          message: "Distractors must be unique",
        });
      }

      const nonExistingDistractorsObjects =
        await this.distractorRepository.save(
          nonExistingDistractors.map((distractor) =>
            this.distractorRepository.create(distractor)
          )
        );

      question.distractors = question.distractors.concat(
        nonExistingDistractorsObjects
      );
    }
    delete questionDetails.distractors;

    question = this.questionRepository.merge(question, questionDetails);
    question.updatedAt = new Date();
    await this.questionRepository.save(question);
    return question;
  }
}
