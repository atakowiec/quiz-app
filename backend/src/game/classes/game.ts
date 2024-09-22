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
import Round from "./round";

export default class Game {
  readonly logger: Logger;

  public gameService: GameService;
  public readonly id: string;

  public owner: GameMember;
  public players: GameMember[] = [];
  public gameStatus: GameStatus = "waiting_for_players";
  public settings: GameSettings;
  public gameType: GameType;

  public round: Round;

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

  /**
   * This method is called every second
   */
  public tick() {
    this.round?.tick()
  }

  public getPacket(member: GameMember): IGamePacket {
    return {
      id: this.id,
      status: this.gameStatus,
      gameType: this.gameType,
      settings: this.settings,
      owner: this.owner.getPacket(),
      answersHistory: member.answersHistory,
      player: member.getPacket(),
      round: this.round?.getPacket(member),
      players: this.getAllPlayers().map((player) => player.getPacket()),
    };
  }

  public getPlayer(socket: SocketType): GameMember {
    return this.getAllPlayers().find((player) => player.socket.id === socket.id);
  }

  public destroy() {
    this.getAllPlayers().forEach((player) => {
      player.socket.leave(this.id);
      delete player.socket.data.gameId;
    });
  }

  /**
   * Adds a player to the game and returns the GameMember object
   *
   * @param playerSocket - the socket of the player
   */
  public join(playerSocket: SocketType) {
    const player = new GameMember(playerSocket, this);
    this.players.push(player);
    player.socket.join(this.id);
    player.socket.data.gameId = this.id;

    this.logger.log(`Player ${player.username} joined the game`);

    this.send();
    player.sendNotification("Dołączono do gry!");
  }

  public kick(username: string) {
    const player = this.players.find((player) => player.username === username);
    if (!player) {
      return;
    }

    player.socket.leave(this.id);
    delete player.socket.data.gameId;
    this.players = this.players.filter((player) => player.username !== username);
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
    this.players = this.players.filter((player) => player.username !== username);
    this.players.push(oldOwner);
    player.socket.emit("notification", "Zostałeś właścicielem gry");

    this.send();
  }

  public send(socket?: SocketType) {
    if (socket) {
      socket.emit("set_game", this.getPacket(this.getPlayer(socket)));
    } else {
      this.getAllPlayers().forEach((player) => player.sendGame());
    }
  }

  public broadcastUpdate(updatePacket: GameUpdatePacket) {
    this.getAllPlayers().forEach((player) =>
      player.sendGameUpdate(updatePacket)
    );
  }

  leave(playerSocket: SocketType) {
    if (this.gameStatus !== "waiting_for_players") {
      return;
    }

    const playerOrOwner = this.getPlayer(playerSocket);
    if (!playerOrOwner) {
      return;
    }
    playerSocket.emit("set_game", null);

    playerOrOwner.socket.leave(this.id);
    delete playerOrOwner.socket.data.gameId;

    // todo handle leaving during the game (maybe add a flag to the player and give them 60s to reconnect)
    // todo send notifications that someone left the game
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
    const member = this.getPlayer(client);

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

  async start() {
    this.nextRound();
  }

  nextRound() {
    this.round = new Round(this);

    // todo here we should get stats from GameMember and save somewhere, for now I am just clearing it
    this.getAllPlayers().forEach(player => {
      player.chosenCategory = -1;
      player.chosenAnswer = null;
      player.answersHistory = [];
    });

    this.round.start();
  }

  selectCategory(playerSocket: SocketType, categoryId: number) {
    const player = this.getPlayer(playerSocket);
    if (!player) {
      return;
    }

    if (this.gameStatus !== "voting_phase") {
      player.sendNotification("Nie możesz teraz tego zrobić!");
      return;
    }

    if (player.chosenCategory !== -1) {
      return;
    }

    this.logger.log(`Player ${player.username} selected category ${categoryId}`);
    player.chosenCategory = categoryId;
    this.round.setTimer(2, this.round.startSelectedCategoryPhase.bind(this.round));

    this.broadcastUpdate({
      players: [{
        username: player.username,
        chosenCategory: categoryId
      }]
    })
  }

  selectAnswer(playerSocket: SocketType, answer: string) {
    const player = this.getPlayer(playerSocket);
    if (!player) {
      return;
    }

    if (this.gameStatus !== "question_phase") {
      player.sendNotification("Nie możesz teraz tego zrobić!");
      return;
    }

    if (player.chosenAnswer || player.answerEndTime <= Date.now()) {
      return;
    }

    player.chosenAnswer = answer

    player.sendGameUpdate({
      player: {
        chosenAnswer: player.chosenAnswer
      }
    })
  }

  getAllPlayers() {
    return [this.owner, ...this.players];
  }
}
