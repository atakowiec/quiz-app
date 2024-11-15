import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateQuestionDto } from "../dtos/CreateQuestion.dto";
import { UpdateQuestionDto } from "../dtos/UpdateQuestion.dto";

import { QuestionsService } from "../services/questions.service";

@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  getQuestions() {
    return this.questionsService.getQuestions();
  }

  @Get("paginate/:category/:page")
  getQuestionsPaginate(
    @Param("category") category: string,
    @Param("page") page: number,
    @Query("limit") limit: number,
    @Query("content") content?: string
  ) {
    limit = limit ? limit : 25;

    return this.questionsService.getQuestionsPaginate(
      category,
      page,
      limit,
      content
    );
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
