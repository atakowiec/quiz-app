import { BadRequestException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { log } from "console";
import { CategoryDto } from "src/questions/dtos/Category.dto";
import { Category } from "src/questions/entities/category.model";
import { Distractor } from "src/questions/entities/distractor.model";
import { Question } from "src/questions/entities/question.model";
import {
  CategoryParams,
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
    let questionsQuery = this.questionRepository
      .createQueryBuilder("questions")
      .leftJoinAndSelect("questions.distractors", "distractors")
      .leftJoinAndSelect("questions.category", "category")
      .take(25);
    return questionsQuery.getMany();
  }
  async getCategoryOrCreateByName(categoryName: string): Promise<Category> {
    let category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (!category) {
      category = this.categoryRepository.create({
        name: categoryName,
      });
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

    // Check if the question is already in the database
    let question = await this.questionRepository.findOne({
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

    let categories = await Promise.all(
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

    // TODO Patching the question
    return 1;
  }
}
