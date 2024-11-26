import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.model";
import { Distractor } from "../entities/distractor.model";
import { Question } from "../entities/question.model";
import { CreateQuestionParams, UpdateQuestionParams } from "../questions";
import { Brackets, Repository } from "typeorm";
import { CategoryService } from "./category.service";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Distractor)
    private distractorRepository: Repository<Distractor>,
    @Inject(CategoryService)
    private categoryService: CategoryService
  ) {
  }

  async getQuestions(): Promise<Question[]> {
    const questionsQuery = this.questionRepository
      .createQueryBuilder("questions")
      .leftJoinAndSelect("questions.distractors", "distractors")
      .leftJoinAndSelect("questions.category", "category")
      .take(25);
    return questionsQuery.getMany();
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

    questionDetails.category = await Promise.all(
      questionDetails.category.map((category) =>
        this.categoryService.getCategoryOrCreateByName(category.name)
      )
    );

    questionDetails.distractors = await this.distractorRepository.save(
      questionDetails.distractors.map((distractor) =>
        this.distractorRepository.create(distractor)
      )
    );

    return this.questionRepository.save(
      this.questionRepository.create({
        ...questionDetails,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
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
      question.category = await Promise.all(
        questionDetails.category.map((category) =>
          this.categoryService.getCategoryOrCreateByName(
            category.name,
            category.description,
            category.img
          )
        )
      );
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

      const nonExistingDistractors = questionDetails.distractors.filter(
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

  async findQuestions(
    category: string,
    page?: number,
    limit?: number,
    content?: string
  ): Promise<{ questions: Question[]; total: number }> {
    const queryBuilder = this.questionRepository
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.category", "category")
      .leftJoinAndSelect("question.distractors", "distractors")
      .where("category.name = :category", { category })
      .andWhere("question.isActive = :isActive", { isActive: true });

    if (content) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("LOWER(question.question) LIKE LOWER(:content)", {
            content: `%${content}%`,
          }).orWhere("LOWER(distractors.content) LIKE LOWER(:content)", {
            content: `%${content}%`,
          });
        })
      );
    }

    if (!content) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    queryBuilder.orderBy("question.createdAt", "DESC");

    const [questions, total] = await queryBuilder.getManyAndCount();

    return { questions, total };
  }

  async getQuestionsPaginate(
    category: string,
    page: number,
    limit: number,
    content?: string
  ): Promise<{ questions: Question[]; totalQuestions: number }> {
    const { questions, total } = await this.findQuestions(
      category,
      page,
      limit,
      content
    );
    return { questions, totalQuestions: total };
  }
}
