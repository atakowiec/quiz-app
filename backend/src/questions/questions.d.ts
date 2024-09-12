import { CategoryDto } from "./dtos/Category.dto";
import { DistractorDto } from "./dtos/Distractor.dto";
import { Category } from "./entities/category.model";
import { Distractor } from "./entities/distractor.model";

export type CreateQuestionParams = {
  question: string;
  photo?: string;
  correctAnswer: string;
  distractors: DistractorDto[];
  category: CategoryDto[];
};

export type CategoryParams = {
  name: string;
};

export type UpdateQuestionParams = {
  question?: string;
  photo?: string;
  correctAnswer?: string;
  distractors?: DistractorDto[];
  category?: CategoryDto[];
};
