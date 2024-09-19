import {
  BadRequestException,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { Body } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { Delete, Patch } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { CreateQuestionDto } from "src/questions/dtos/CreateQuestion.dto";
import { UpdateQuestionDto } from "src/questions/dtos/UpdateQuestion.dto";

import { QuestionsService } from "src/questions/services/questions/questions.service";
@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}
  @Get()
  getQuestions() {
    return this.questionsService.getQuestions();
  }

  @Get("categories")
  getCategories() {
    return this.questionsService.getCategories();
  }

  @Get("paginate/:category/:page")
  getQuestionsPaginate(
    @Param("category") category: string,
    @Param("page") page: number,
    @Query("limit") limit: number
  ) {
    limit = limit ? limit : 25;

    return this.questionsService.getQuestionsPaginate(category, page, limit);
  }

  @Post()
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    if (createQuestionDto.distractors.length != 3) {
      throw new BadRequestException({
        message: "Distractors must be 3",
      });
    }
    if (createQuestionDto.category.length < 1) {
      throw new BadRequestException({
        message: "Question must have at least one category",
        status: 400,
      });
    }

    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Delete(":questionId")
  deleteQuestion(@Param("questionId", ParseIntPipe) questionId: number) {
    return this.questionsService.deleteQuestion(questionId);
  }

  @Patch(":questionId")
  updateQuestion(
    @Param("questionId", ParseIntPipe) questionId: number,
    @Body() updateQuestionDto: UpdateQuestionDto
  ) {
    return this.questionsService.patchQuestion(questionId, updateQuestionDto);
  }
}
