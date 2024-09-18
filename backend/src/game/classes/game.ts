import { GameMember } from "./game-member";
import { GameService } from "../services/game.service";
import { SocketType } from "../game.types";
import { createGameID } from "src/utils/ids";
import { GameSettings, GameStatus, GameType, IGamePacket } from "@shared/game";

export default class Game {
  public gameService: GameService;
  public readonly id: string;

  public owner: GameMember;
  public players: GameMember[] = [];
  public gameStatus: GameStatus = "waiting_for_players";
  public settings: GameSettings;
  public gameType: GameType;

  constructor(owner: SocketType, gameService: GameService, gameType: GameType) {
    this.gameService = gameService;

    this.settings = {
      number_of_rounds: 5,
      number_of_questions_per_round: 5,
      number_of_categories_per_voting: 3,
      time_for_answer: 30,
      max_number_of_players: 49,
    };

    this.id = createGameID();
    this.owner = new GameMember(owner, this);
    this.gameType = gameType;
    this.owner.socket.join(this.id);
    this.owner.socket.data.gameId = this.id;

    console.log(`Game created with id: ${this.id} by ${this.owner.username}`);
  }

  public getPacket(): IGamePacket {
    return {
      id: this.id,
      status: this.gameStatus,
      gameType: this.gameType,
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

  send(socket?: SocketType) {
    if (socket) {
      socket.emit("set_game", this.getPacket());
    } else {
      this.owner.sendGameUpdate();
      this.players.forEach((player) => player.sendGameUpdate());
    }
  }
  leave(playerSocket: SocketType) {
    if (this.gameStatus !== "waiting_for_players") {
      return;
    }

    const playerOrOwner =
      this.owner.socket.id === playerSocket.id
        ? this.owner
        : this.players.find((player) => player.socket.id === playerSocket.id);
    if (!playerOrOwner) {
      return;
    }

    playerOrOwner.socket.leave(this.id);
    delete playerOrOwner.socket.data.gameId;

    if (playerOrOwner === this.owner) {
      if (this.players.length > 0) {
        this.owner = this.players[0];
        this.players.shift();
        this.send();
      } else {
        playerSocket.emit("set_game", null);
        this.gameService.removeGame(this);
      }
    } else {
      this.players = this.players.filter(
        (player) => player.socket.id !== playerSocket.id
      );

      this.send();

      playerOrOwner.socket.emit(
        "notification",
        JSON.stringify(this.getPacket())
      );
    }
  }
}
