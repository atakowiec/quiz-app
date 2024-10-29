import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { GameId } from "@shared/game";
import Game from "src/game/classes/game";
import { SocketType } from "src/game/game.types";
import { GameService } from "src/game/services/game.service";

@Injectable()
export class MatchmakingService {
  private static readonly ROOM_NAME = "queue";

  public server_game_room: GameId = null;

  private readonly logger = new Logger(MatchmakingService.name);

  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService
  ) {}

  public queuePlayer(playerSocket: SocketType): Game {
    // if player is already in game, return
    if (this.gameService.getGameByUsername(playerSocket.data.username)) {
      throw new Error("Jesteś już w grze!");
    }
    playerSocket.join(MatchmakingService.ROOM_NAME);

    const currentGame = this.gameService.getGameById(this.server_game_room);
    this.logger.log("Current game: " + currentGame?.id);
    if (currentGame && currentGame?.gameStatus != "waiting_for_players") {
      this.logger.log("Game is already in progress, clearing the game");
      this.server_game_room = null;
    } else if (currentGame) {
      this.logger.log("Game is waiting for players, joining the game");
      currentGame.join(playerSocket);
      playerSocket.leave(MatchmakingService.ROOM_NAME);
      return currentGame;
    } else if (this.gameService.getLengthOfTheQueue() <= 1) {
      this.logger.log("Player added to the queue, Waiting for more players");
      return;
    }

    // Jeśli nie ma wolnej gry, stworzonej przez serwer, to stwórz nową
    if (this.gameService.getLengthOfTheQueue() > 1) {
      this.logger.log("Creating new game because there are enough players");
      const game = this.gameService.createGame(null, "matchmaking");
      this.server_game_room = game.id;
      const players = this.gameService.getPlayersFromQueue();
      players.forEach((player) => {
        this.logger.debug("Player: " + player.data.username);
        player.leave(MatchmakingService.ROOM_NAME);
        game.join(player);
        player.emit("game_joined");
      });
      this.logger.log("Game id: " + game.id);
      return game;
    }
  }

  public tryRemovePlayerFromQueue(playerSocket: SocketType): void {
    if (playerSocket.rooms.has(MatchmakingService.ROOM_NAME)) {
      playerSocket.leave(MatchmakingService.ROOM_NAME);
    }
  }
  public isPlayerInQueue(playerSocket: SocketType): boolean {
    return playerSocket.rooms.has(MatchmakingService.ROOM_NAME);
  }
}
