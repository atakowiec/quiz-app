import { forwardRef, Inject, Injectable } from "@nestjs/common";
import Game from "../classes/game";
import { GameGateway } from "../gateways/game.gateway";
import { SocketType } from "../game.types";
import { GameType } from "@shared/game";

@Injectable()
export class GameService {
  private readonly games: Game[] = [];

  constructor(
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway
  ) {}

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
    return this.games.find(
      (game) =>
        game.owner.username.includes(username) ||
        game.players.some((player) => player.username.includes(username))
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

  public getAllGames() {
    return JSON.stringify(this.games.map((game) => game.getPacket()));
  }
}
