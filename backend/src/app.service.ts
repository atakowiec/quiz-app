import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { Distractor } from "./questions/entities/distractor.model";
import { Question } from "./questions/entities/question.model";
import { Category } from "./questions/entities/category.model";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Distractor)
    private distractorRepository: Repository<Distractor>
  ) {}

  async createTestQuestion(): Promise<string> {
    const distractors = await this.distractorRepository.save([
      this.distractorRepository.create({ content: "London" }),
      this.distractorRepository.create({ content: "Berlin" }),
      this.distractorRepository.create({ content: "Madrid" }),
    ]);

    const category = await this.categoryRepository.save(
      this.categoryRepository.create({
        name: "Geography",
        description: "Questions about the world",
      })
    );

    const newQuestion = await this.questionRepository.save(
      this.questionRepository.create({
        question: "What is the capital of France?",
        correctAnswer: "Paris",
        createdAt: new Date(),
        updatedAt: new Date(),
        distractors: distractors,
        category: [category],
      })
    );
    return newQuestion.question;
  }
}
