import { Module } from "@nestjs/common";
import { QuestionsService } from "./services/questions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Distractor } from "./entities/distractor.model";
import { Question } from "./entities/question.model";
import { QuestionsController } from "./controllers/questions.controller";
import { Category } from "./entities/category.model";
import { CategoryService } from "./services/category.service";
import { CategoryController } from "./controllers/category.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Distractor, Question, Category])],
  providers: [QuestionsService, CategoryService],
  controllers: [QuestionsController, CategoryController],
  exports: [QuestionsService, CategoryService],
})
export class QuestionsModule {}
