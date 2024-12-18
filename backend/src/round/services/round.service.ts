import { BadRequestException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { NotFoundError } from "rxjs";
import { Category } from "src/questions/entities/category.model";
import { Question } from "src/questions/entities/question.model";
import { QuestionsService } from "src/questions/services/questions/questions.service";

@Injectable()
export class RoundService {
  constructor(private readonly questionService: QuestionsService) {}
  /*
      This method returns randomly choosen n categories from the database.
      Used for category voting on the start of the round.
      For a given n, the method should return n categories.
 */
  async shuffleCategories(n: number): Promise<Category[]> {
    const categories: Category[] = await this.questionService.getCategories();
    const shuffleCategories: Category[] = categories
      .sort(() => Math.random() - 0.5)
      .slice(0, n);

    return shuffleCategories;
  }

  /*
        This method returns randomly choosen n questions from the database.
        Used for question selection in the round.
        For a given n and category, the method should return n questions from the given category.
        If the category does not exist, the method should throw a NotFoundException.
    */

  async shuffleQuestions(
    category: Category | string,
    n: number
  ): Promise<Question[]> {
    if (n < 1) {
      throw new BadRequestException(
        "Number of questions must be greater than 0"
      );
    }

    let categoryObj: Category | null = null;
    if (typeof category === "string") {
      const categories = await this.questionService.getCategories();
      categoryObj = categories.find((cat) => cat.name === category) || null;
    } else {
      categoryObj = category;
    }
    if (!categoryObj) {
      throw new NotFoundException("Category not found");
    }

    const randomQuestions: Question[] =
      await this.questionService.getQuestionsByCategory(categoryObj);

    const lenOfQuestions: number = randomQuestions.length;
    var usedIndexes: number[] = [];
    var shuffledQuestions: Question[] = [];

    for (let i = 0; i < n; i++) {
      if (i + 1 > lenOfQuestions) {
        break;
      }
      var randomIndex: number = Math.floor(Math.random() * lenOfQuestions);
      while (usedIndexes.includes(randomIndex)) {
        randomIndex = Math.floor(Math.random() * lenOfQuestions);
      }
      usedIndexes.push(randomIndex);
      shuffledQuestions.push(randomQuestions[randomIndex]);
    }
    return shuffledQuestions;
  }
}
