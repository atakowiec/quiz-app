import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "./questions/entities/question.model";
import { Category } from "./questions/entities/category.model";
import { Distractor } from "./questions/entities/distractor.model";

describe("AppService", () => {
  let appService: AppService;
  let questionRepository: Repository<Question>;
  let categoryRepository: Repository<Category>;
  let distractorRepository: Repository<Distractor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(Question),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Distractor),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    questionRepository = module.get<Repository<Question>>(
      getRepositoryToken(Question)
    );
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
    distractorRepository = module.get<Repository<Distractor>>(
      getRepositoryToken(Distractor)
    );
  });

  describe("createTestQuestion", () => {
    it("should return the question text", async () => {
      const distractors = [
        { content: "London", id: 1 },
        { content: "Berlin", id: 2 },
        { content: "Madrid", id: 3 },
      ];
      const category = {
        name: "Geography",
        description: "Questions about the world",
        id: 1,
      };
      const newQuestion = {
        question: "What is the capital of France?",
        correctAnswer: "Paris",
        distractors,
        category: [category],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(distractorRepository, "save")
        .mockResolvedValue(distractors as any);
      jest.spyOn(categoryRepository, "save").mockResolvedValue(category as any);
      jest
        .spyOn(questionRepository, "save")
        .mockResolvedValue(newQuestion as any);

      expect(await appService.createTestQuestion()).toBe(
        "What is the capital of France?"
      );
    });
  });
});
