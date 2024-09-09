import {Injectable} from '@nestjs/common';
import {Question} from "./questions/question.model";
import {Repository} from "typeorm";
import {Category} from "./questions/category.model";
import {InjectRepository} from "@nestjs/typeorm";
import {Distractor} from "./questions/distractor.model";

@Injectable()
export class AppService {
  constructor(@InjectRepository(Distractor)
              private readonly distractorRepository: Repository<Distractor>,
              @InjectRepository(Question)
              private readonly questionRepository: Repository<Question>) {
    // empty
  }

  async getHello(): Promise<number> {
    const question = new Question();
    question.correctAnswer = '42';
    question.question = 'What is the answer to life, the universe, and everything?';
    question.isActive = true;
    question.createdAt = new Date();
    question.updatedAt = new Date();

    const distractor = new Distractor();
    distractor.content = '41';
    distractor.question = question;

    const category = new Category();
    category.name = 'General Knowledge';
    category.description = 'General knowledge questions';

    question.category = [category];
    question.distractors = [distractor];
    question.photo = 'https://www.google.com';

    const savedQuestion = await this.questionRepository.save(question);
    const saved = await this.distractorRepository.save(distractor);

    return saved.id;
  }
}
