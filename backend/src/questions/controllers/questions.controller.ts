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
  UseGuards,
} from "@nestjs/common";
import { CreateQuestionDto } from "../dtos/CreateQuestion.dto";
import { UpdateQuestionDto } from "../dtos/UpdateQuestion.dto";

import { QuestionsService } from "../services/questions.service";
import { Roles, RolesEnum } from "../../guards/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";

@Controller("questions")
@UseGuards(RolesGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @Roles([RolesEnum.ADMIN])
  getQuestions() {
    return this.questionsService.getQuestions();
  }

  @Get("paginate/:category/:page")
  @Roles([RolesEnum.ADMIN])
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
  @Roles([RolesEnum.ADMIN])
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
  @Roles([RolesEnum.ADMIN])
  changeStatus(@Param("questionId", ParseIntPipe) questionId: number) {
    return this.questionsService.changeStatus(questionId);
  }

  @Patch(":questionId")
  @Roles([RolesEnum.ADMIN])
  updateQuestion(
    @Param("questionId", ParseIntPipe) questionId: number,
    @Body() updateQuestionDto: UpdateQuestionDto
  ) {
    return this.questionsService.patchQuestion(questionId, updateQuestionDto);
  }
}
