import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.model";
import { Distractor } from "../entities/distractor.model";
import { Question } from "../entities/question.model";
import { CreateQuestionParams, UpdateQuestionParams } from "../questions";
import { Brackets, Repository } from "typeorm";
import { CategoryService } from "./category.service";

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Distractor)
    private distractorRepository: Repository<Distractor>,
    @Inject(CategoryService)
    private categoryService: CategoryService
  ) {}

  async getQuestions(): Promise<Question[]> {
    const questionsQuery = this.questionRepository
      .createQueryBuilder("questions")
      .leftJoinAndSelect("questions.distractors", "distractors")
      .leftJoinAndSelect("questions.category", "category")
      .take(25);
    return questionsQuery.getMany();
  }

  async createQuestion(questionDetails: CreateQuestionParams) {
    this.logger.log(`Creating question: ${questionDetails.question}`);
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
    this.logger.log(`Creating question2: `);

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

  async changeStatus(questionId: number) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });
    question.isActive = !question.isActive;
    question.updatedAt = new Date();

    await this.questionRepository.save(question);
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

      // Remove existing distractors that are not in the new distractors
      const clearedDistractors = question.distractors.filter((distractor) =>
        questionDetails.distractors
          .map((distractor) => distractor.content)
          .includes(distractor.content)
      );

      const distractorsToRemove = question.distractors.filter(
        (distractor) => !clearedDistractors.includes(distractor)
      );

      const nonExistingDistractors = questionDetails.distractors.filter(
        (distractor) =>
          !clearedDistractors
            .map((distractor) => distractor.content)
            .includes(distractor.content)
      );

      // Check if new distractors are unique
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

      for (let i = 0; i < nonExistingDistractors.length; i++) {
        question.distractors.find(
          (distractor) => distractor.content === distractorsToRemove[i].content
        ).content = nonExistingDistractors[i].content;
      }
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
      .where("category.name = :category", { category });
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
    const questionsWithCategories: Question[] = await Promise.all(
      questions.map(async (question) => {
        return this.questionRepository.findOne({
          where: { id: question.id },
          relations: ["category", "distractors"],
        });
      })
    );
    return { questions: questionsWithCategories, total };
  }

  async getQuestionsPaginate(
    category: string,
    page: number,
    limit: number,
    content?: string
  ): Promise<{ questions: Question[]; totalQuestions: number }> {
    this.logger.log(`Getting questions for category ${category}`);
    const { questions, total } = await this.findQuestions(
      category,
      page,
      limit,
      content
    );
    return { questions, totalQuestions: total };
  }
}
