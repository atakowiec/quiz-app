import { Controller, Get, Param } from "@nestjs/common";
import { GameHistoryService } from "../services/game-history.service";
import { AvgScorePerCategoryForUser } from "../classes/filters/AvgScorePerCategoryForUser";
import { CountGamesPerCategoryForUser } from "../classes/filters/CountGamesPerCategoryForUser";

@Controller("history")
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Get("user/:userId")
  getUserGameHistory(@Param("userId") userId: number) {
    return this.gameHistoryService.getUserGameHistory(userId);
  }

  @Get("stats/:userId")
  getUserProfileStats(@Param("userId") userId: number) {
    return this.gameHistoryService.getUserStats(userId);
  }

  @Get("stats/:userId/category/avg")
  getUserCategoryAvgStats(@Param("userId") userId: number) {
    return this.gameHistoryService.getCategoryStatistics(
      new AvgScorePerCategoryForUser(userId)
    );
  }

  @Get("stats/:userId/category/count")
  getUserCategoryGameStats(@Param("userId") userId: number) {
    return this.gameHistoryService.getCategoryStatistics(
      new CountGamesPerCategoryForUser(userId)
    );
  }

  @Get("stats/:userId/avg/history")
  getUserAvgHistory(@Param("userId") userId: number) {
    return this.gameHistoryService.getUserAverageHistory(userId);
  }
}
