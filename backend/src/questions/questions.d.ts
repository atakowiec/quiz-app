import { CategoryDto } from "./dtos/Category.dto";
import { DistractorDto } from "./dtos/Distractor.dto";

export type CreateQuestionParams = {
  question: string;
  photo?: string;
  correctAnswer: string;
  distractors: DistractorDto[];
  category: CategoryDto[];
};

export type UpdateQuestionParams = {
  question?: string;
  photo?: string;
  correctAnswer?: string;
  distractors?: DistractorDto[];
  category?: CategoryDto[];
};
