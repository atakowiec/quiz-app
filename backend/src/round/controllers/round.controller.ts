import { Param } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { RoundService } from "../services/round.service";
import { Category } from "src/questions/entities/category.model";

// For testing purposes
@Controller("round")
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Get("raffle/category/:n")
  getShuffledCategories(@Param("n") n: number): Promise<Category[]> {
    return this.roundService.shuffleCategories(n);
  }

  @Get("raffle/questions/:category/:n")
  getShuffledQuestions(
    @Param("category") category: string,
    @Param("n") n: number
  ) {
    return this.roundService.shuffleQuestions(category, n);
  }
}
