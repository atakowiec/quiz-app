import { GameMember } from "./game-member";
import { GameService } from "../services/game.service";
import { SocketType } from "../game.types";
import { createGameID } from "src/utils/ids";
import { GameSettings, GameStatus, IGamePacket } from "@shared/game";

export default class Game {
  public gameService: GameService;
  public readonly id: string;

  public owner: GameMember;
  public players: GameMember[] = [];
  public gameStatus: GameStatus = "waiting_for_players";
  public settings: GameSettings;

  constructor(
    owner: SocketType,
    gameService: GameService,
    settings?: GameSettings
  ) {
    this.gameService = gameService;

    if (!settings) {
      settings = {
        number_of_rounds: 5,
        number_of_questions_per_round: 5,
        number_of_categories_per_voting: 10,
        time_for_answer: 30,
        max_number_of_players: 49,
      };
    } else {
      this.settings = settings;
    }

    this.id = createGameID();
    this.owner = new GameMember(owner, this);

    this.owner.socket.join(this.id);
    this.owner.socket.data.gameId = this.id;

    console.log(`Game created with id: ${this.id} by ${this.owner.nickname}`);
  }

  public getPacket(): IGamePacket {
    return {
      status: this.gameStatus,
      settings: this.settings,
      owner: this.owner.getPacket(),
      players: this.players.map((player) => player.getPacket()),
    };
  }

  public destroy() {
    this.players.forEach((player) => {
      player.socket.leave(this.id);
      delete player.socket.data.gameId;
    });
    this.owner.socket.leave(this.id);
    delete this.owner.socket.data.gameId;
  }

  public join(playerSocket: SocketType) {
    const player = new GameMember(playerSocket, this);
    this.players.push(player);
    player.socket.join(this.id);
    player.socket.data.gameId = this.id;
  }
}
