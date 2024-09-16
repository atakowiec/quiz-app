import { forwardRef, Inject, Injectable } from "@nestjs/common";
import Game from "../classes/game";
import { GameGateway } from "../gateways/game.gateway";
import { GameSettings } from "@shared/game";
import { SocketType } from "../game.types";

@Injectable()
export class GameService {
  private readonly games: Game[] = [];

  constructor(
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway
  ) {}

  public createGame(owner: SocketType, settings: GameSettings) {
    const game = new Game(owner, this, settings);
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

  public getGameByNickname(nickname: string): Game {
    return this.games.find(
      (game) =>
        game.owner.nickname.includes(nickname) ||
        game.players.some((player) => player.nickname.includes(nickname))
    );
  }

  public isUsernameConnected(nickname: string): boolean {
    for (const socket of this.gameGateway.server.sockets.sockets?.values()) {
      if (socket.data.nickname === nickname) {
        return true;
      }
    }
    return false;
  }
}
