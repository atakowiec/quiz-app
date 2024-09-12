import { IsArray, IsOptional, IsString } from "class-validator";
import { DistractorDto } from "./Distractor.dto";
import { CategoryDto } from "./Category.dto";
export class UpdateQuestionDto {
  @IsOptional()
  @IsString({
    message: "Question has to be a string",
  })
  question: string;

  @IsOptional()
  @IsString({
    message: "Photo must be a string",
  })
  photo: string | null;

  @IsOptional()
  @IsString({
    message: "Correct answer is a string",
  })
  correctAnswer: string;

  @IsOptional()
  @IsArray({
    message: "Distractors has to be an array",
  })
  distractors: DistractorDto[];

  @IsOptional()
  @IsArray({
    message: "Category has to be an array",
  })
  category: CategoryDto[];
}
