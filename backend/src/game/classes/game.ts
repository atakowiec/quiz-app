import { GameMember } from "./game-member";
import { GameService } from "../services/game.service";
import { SocketType } from "../game.types";
import { createGameID } from "src/utils/ids";
import {
  GameSettings,
  GameStatus,
  GameType,
  GameUpdatePacket,
  IGamePacket,
} from "@shared/game";
import { Logger } from "@nestjs/common";

export default class Game {
  private readonly logger: Logger;

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

    this.logger = new Logger(`game-${this.id}`);
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

    this.logger.log(`Player ${player.username} joined the game`);
  }

  public kick(username: string) {
    const player = this.players.find((player) => player.username === username);
    if (!player) {
      return;
    }

    player.socket.leave(this.id);
    delete player.socket.data.gameId;
    this.players = this.players.filter(
      (player) => player.username !== username
    );
    player.socket.emit("set_game", null);
    player.socket.emit("notification", "Zostałeś wyrzucony z gry");

    this.send();
  }

  public giveOwner(username: string) {
    const player = this.players.find((player) => player.username === username);
    if (!player) {
      return;
    }

    this.owner.socket.emit("notification", "Zmiana właściciela gry");

    const oldOwner = this.owner;
    this.owner = player;
    this.players = this.players.filter(
      (player) => player.username !== username
    );
    this.players.push(oldOwner);
    player.socket.emit("notification", "Zostałeś właścicielem gry");

    this.send();
  }

  public send(socket?: SocketType) {
    if (socket) {
      socket.emit("set_game", this.getPacket());
    } else {
      this.owner.sendGame();
      this.players.forEach((player) => player.sendGame());
    }
  }

  public broadcastUpdate(updatePacket: GameUpdatePacket) {
    [this.owner, ...this.players].forEach((player) =>
      player.sendGameUpdate(updatePacket)
    );
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
    playerSocket.emit("set_game", null);

    playerOrOwner.socket.leave(this.id);
    delete playerOrOwner.socket.data.gameId;

    if (playerOrOwner === this.owner) {
      if (this.players.length > 0) {
        this.owner = this.players[0];
        this.players.shift();
        this.send();
      } else {
        this.gameService.removeGame(this);
      }
    } else {
      this.players = this.players.filter(
        (player) => player.socket.id !== playerSocket.id
      );

      this.send();
    }
  }

  reconnect(client: SocketType) {
    // find the game member
    const member = [this.owner, ...this.players].find(
      (player) => player.username === client.data.username
    );

    if (!member) return;

    if (member.socket.connected) {
      // todo lekka kraksa - ktos probuje sie polaczyc z drugiego konta - trzeba ukrócić takie wybryki
      return;
    }

    // update the socket to the new one
    member.socket = client;
    member.socket.join(this.id);

    // send the game to the client
    member.sendGame();

    // TODO in the future there might be a need to send the game to all the players
  }

  start() {
    this.gameStatus = "voting_phase";
    this.broadcastUpdate({ status: this.gameStatus });
  }
}
