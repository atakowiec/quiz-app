import { GameMember } from "./game-member";
import { GameService } from "../services/game.service";
import { SocketType } from "../game.types";
import { createGameID } from "src/utils/ids";
import { GameSettings, GameStatus, GameType, GameUpdatePacket, IGamePacket, } from "@shared/game";
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
  public roundNumber = 0;

  constructor(owner: SocketType, gameService: GameService, gameType: GameType) {
    this.gameService = gameService;

    this.settings = {
      number_of_rounds: 1,
      number_of_questions_per_round: 3,
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
    this.round?.tick();
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
    return this.getAllPlayers().find(
      (player) => player.username === socket.data.username
    );
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

  public broadcastUpdateForAllPlayersThatHaveShownAnswers(
    updatePacket: GameUpdatePacket
  ) {
    this.getAllPlayers()
      .filter((player) => player.showOtherPlayersAnswers)
      .forEach((player) => player.sendGameUpdate(updatePacket));
  }

  public broadcastNotification(message: string) {
    this.getAllPlayers().forEach((player) => player.sendNotification(message));
  }

  /**
   * Handles ONLY leaving game peacefully using the 'leave' button
   * Leaving game by disconnect is handled in this::onPlayerDisconnect
   * But disconnecting in the waiting room or leaderboard calls this method
   *
   * @param playerSocket the socket that wants to leave the game
   */
  leave(playerSocket: SocketType) {
    if (!["leaderboard", "waiting_for_players"].includes(this.gameStatus)) {
      return;
    }
    this.logger.log(`Player ${playerSocket.data.username} has left the game`);

    const playerOrOwner = this.getPlayer(playerSocket);
    if (!playerOrOwner) {
      return;
    }

    this.removePlayer(playerOrOwner);
  }

  /**
   * Handles player disconnecting from the game
   * @param playerSocket
   */
  onPlayerDisconnect(playerSocket: SocketType) {
    if (["leaderboard", "waiting_for_players"].includes(this.gameStatus)) {
      this.leave(playerSocket);
      return;
    }

    const player = this.getPlayer(playerSocket);
    if (!player) return;

    this.logger.log(
      `Player ${player.username} disconnected from the game - waiting 60s before removing him`
    );
    player.setDisconnectTimeout(() => {
      this.removePlayer(player);
    });
  }

  /**
   * Force removes given game member from the game
   */
  removePlayer(gameMember: GameMember) {
    this.logger.log(
      `Player ${gameMember.username} has been removed from the game`
    );
    gameMember.socket.emit("set_game", null);

    gameMember.socket.leave(this.id);
    delete gameMember.socket.data.gameId;

    if (gameMember === this.owner) {
      if (this.players.length > 0) {
        this.owner = this.players[0];
        this.players.shift();
        this.send();

        this.broadcastNotification(
          `Właściciel pokoju opuścił grę, ${this.owner.username} zostaje nowym właścicielem.`
        );
      } else {
        this.gameService.removeGame(this);
      }
    } else {
      this.players = this.players.filter(
        (player) => player.socket.id !== gameMember.socket.id
      );
      this.broadcastNotification(`${gameMember.username} opuścił grę.`);

      this.send();
    }
  }

  reconnect(client: SocketType) {
    // find the game member
    const member = this.getPlayer(client);

    if (!member) return;

    if (member.socket.connected) {
      this.logger.warn(
        `Player ${member.username} tried to reconnect, but he is already connected`
      );
      // todo lekka kraksa - ktos probuje sie polaczyc z drugiego konta - trzeba ukrócić takie wybryki
      return;
    }
    this.logger.log(`Player ${member.username} reconnected to the game`);
    this.broadcastNotification(`${member.username} wrócił do gry!`);

    // update the socket to the new one
    member.socket = client;
    member.socket.join(this.id);
    member.clearDisconnectTimeout();
    member.sendNotification("Ponownie połączono z grą!");

    // send the game to the client
    member.sendGame();

    // TODO in the future there might be a need to send the game to all the players
  }

  async start() {
    this.logger.log("Game started");
    this.nextRound();
  }

  nextRound() {
    this.round = new Round(this);
    this.roundNumber++;

    // todo here we should get stats from GameMember and save somewhere, for now I am just clearing it
    this.getAllPlayers().forEach((player) => {
      player.score = 0;
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

    this.logger.log(
      `Player ${player.username} selected category ${categoryId}`
    );
    player.chosenCategory = categoryId;

    // if everyone selected the category, we can move to the next phase
    if (this.players.every((player) => player.chosenCategory !== -1)) {
      this.round.setTimer(2, this.round.endVoting.bind(this.round));
    }

    this.broadcastUpdate({
      players: [
        {
          username: player.username,
          chosenCategory: categoryId,
        },
      ],
    });
  }

  getPlayersWithTheirAnswers() {
    return this.getAllPlayers()
      .filter((player) => player.chosenAnswer)
      .map((player) => ({
        username: player.username,
        chosenAnswer: player.chosenAnswer,
      }));
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

    player.chosenAnswer = answer;

    player.sendGameUpdate({
      player: {
        chosenAnswer: player.chosenAnswer,
      },
    });

    const playersThatAnswered = this.getPlayersWithTheirAnswers();

    this.broadcastUpdateForAllPlayersThatHaveShownAnswers({
      players: playersThatAnswered,
    });
  }

  public endGame() {
    this.logger.log(`Game with id ${this.id} ended`);
    this.gameStatus = "game_over";
    this.broadcastUpdate({ status: "game_over" });

    // TODO: save the game to the database
    // TODO: calculate the winner

    this.players.forEach((player) => {
      if (!player.socket.data.userId) {
        player.socket.disconnect();
      }
    });

    setTimeout(() => {
      this.gameService.removeGame(this);
    }, 10000);
  }

  getAllPlayers() {
    return [this.owner, ...this.players];
  }

  checkPlayer(socket: SocketType): GameMember {
    const player = this.getPlayer(socket);
    if (!player) {
      return;
    }
    if (this.gameStatus !== "question_phase") {
      player.sendNotification("Nie możesz teraz tego zrobić!");
      return;
    }
    if (player.chosenAnswer || player.answerEndTime <= Date.now()) {
      player.sendNotification("Nie możesz teraz tego zrobić!");
      return;
    }
    return player;
  }

  fiftyFifty(socket: SocketType) {
    const player = this.getPlayer(socket);
    player.availableHelpers = player.availableHelpers.filter(
      (helper) => helper.name !== "fifty_fifty"
    );

    player.hiddenAnswers = player.question.answers.filter(
      (answer) => answer !== this.round.chosenQuestion.correctAnswer
    );
    player.hiddenAnswers.splice(
      Math.floor(Math.random() * player.hiddenAnswers.length),
      1
    );

    player.sendGameUpdate({
      player: {
        hiddenAnswers: player.hiddenAnswers,
      },
    });

    player.sendNotification("Użyłeś 50/50");
  }

  cheatFromOthers(socket: SocketType) {
    const player = this.getPlayer(socket);

    player.availableHelpers = player.availableHelpers.filter(
      (helper) => helper.name !== "cheat_from_others"
    );

    player.showOtherPlayersAnswers = true;

    const playersThatAnswered = this.getPlayersWithTheirAnswers();

    player.sendGameUpdate({
      player: {
        showOtherPlayersAnswers: true,
      },
      players: playersThatAnswered,
    });

    player.sendNotification("Ściągasz od innych graczy");
  }

  extendTime(socket: SocketType) {
    const player = this.getPlayer(socket);

    player.availableHelpers = player.availableHelpers.filter(
      (helper) => helper.name !== "extend_time"
    );

    this.round.extendTime(player);

    player.sendGameUpdate({
      round: {
        timerEnd: player.answerEndTime,
      },
    });
    player.sendNotification("Przedłużono czas na odpowiedź");
  }
}
