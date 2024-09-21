import { forwardRef, Inject, Injectable } from "@nestjs/common";
import Game from "../classes/game";
import { GameGateway } from "../gateways/game.gateway";
import { SocketType } from "../game.types";
import { GameType } from "@shared/game";
import { Category } from "../../questions/entities/category.model";
import { QuestionsService } from "../../questions/services/questions/questions.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GameService {
  private readonly games: Game[] = [];

  constructor(
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,
    @Inject()
    public readonly questionsService: QuestionsService,
    @Inject()
    public readonly configService: ConfigService
  ) {
    setInterval(() => this.tickGames(), 1000);
  }

  tickGames() {
    this.games.forEach((game) => game.tick());
  }

  public createGame(owner: SocketType, gameType: GameType) {
    const game = new Game(owner, this, gameType);
    this.games.push(game);
    return game;
  }

  public getGameById(id: string): Game {
    return this.games.find((game) => game.id === id);
  }

  public removeGame(game: Game) {
    const index = this.games.indexOf(game);
    if (index !== -1) {
      this.games.splice(index, 1);
    }
    game.destroy();
  }

  public getGameByNickname(username: string): Game {
    return this.games.find((game) =>
      game.owner.username === username ||
      game.players.some((player) => player.username === username)
    );
  }

  public isUsernameConnected(username: string): boolean {
    for (const socket of this.gameGateway.server.sockets.sockets.values()) {
      if (socket.data.username === username) {
        return true;
      }
    }
    return false;
  }

  public async getCategories(): Promise<Category[]> {
    return await this.questionsService.getCategories();
  }

  public getAllGames() {
    // I don't know if this endpoint is needed but for now it will return game packet like this because GamePacket is now member based
    return JSON.stringify(this.games.map((game) => ({
      id: game.id,
      owner: game.owner,
      players: game.players.map((player) => player.username),
      status: game.gameStatus,
      gameType: game.gameType
    })));
  }
}
