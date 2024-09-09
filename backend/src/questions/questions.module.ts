import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Distractor} from "./distractor.model";
import {Question} from "./question.model";
import { QuestionsController } from './questions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Distractor, Question])],
  providers: [QuestionsService],
  controllers: [QuestionsController]
})
export class QuestionsModule {}
