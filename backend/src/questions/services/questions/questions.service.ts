import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/questions/entities/category.model";
import { Distractor } from "src/questions/entities/distractor.model";
import { Question } from "src/questions/entities/question.model";
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

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getQuestionsByCategory(category: Category): Promise<Question[]> {
    return this.questionRepository.find({
      where: { category: category },
      relations: ["distractors"],
    });
  }
}
