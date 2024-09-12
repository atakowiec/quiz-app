import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { DistractorDto } from "./Distractor.dto";
import { CategoryDto } from "./Category.dto";
export class CreateQuestionDto {
  @IsString({
    message: "Question has to be a string",
  })
  @IsNotEmpty({
    message: "Question is required",
  })
  question: string;

  @IsOptional()
  @IsString({
    message: "Photo must be a string",
  })
  photo: string | null;

  @IsString({
    message: "Correct answer is required",
  })
  correctAnswer: string;

  @IsArray({
    message: "Distractors array is required",
  })
  distractors: DistractorDto[];

  @IsArray({
    message: "Category array is required",
  })
  category: CategoryDto[];
}
