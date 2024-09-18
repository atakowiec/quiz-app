import { Controller, Get } from "@nestjs/common";
import { GameService } from "./services/game.service";

// For Testing Purposes
@Controller("games")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get("all")
  getGames() {
    return this.gameService.getAllGames();
  }
}
