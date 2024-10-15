import { Controller, Get, Param } from "@nestjs/common";
import { GameHistoryService } from "../services/game-history.service";

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
}
