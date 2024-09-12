import { Module } from "@nestjs/common";
import { QuestionsService } from "./services/questions/questions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Distractor } from "./entities/distractor.model";
import { Question } from "./entities/question.model";
import { QuestionsController } from "./controllers/questions/questions.controller";
import { Category } from "./entities/category.model";

@Module({
  imports: [TypeOrmModule.forFeature([Distractor, Question, Category])],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  exports: [QuestionsService],
})
export class QuestionsModule {}
