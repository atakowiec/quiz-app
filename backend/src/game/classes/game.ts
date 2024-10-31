import { GameMember } from "./game-member";
import { GameService } from "../services/game.service";
import { CategoryUserScore, SocketType } from "../game.types";
import { createGameID } from "src/utils/ids";
import {
  CategoryId,
  GameSettings,
  GameStatus,
  GameType,
  GameUpdatePacket,
  HelperType,
  IGamePacket,
} from "@shared/game";
import { Logger } from "@nestjs/common";
import Round from "./round";
import { log } from "console";
import GameInvite from "../../notifications/classes/game-invite";
import { WsException } from "@nestjs/websockets";

export default class Game {
  readonly logger: Logger;

  public gameService: GameService;
  public readonly id: string;

  public owner: GameMember | null;
  public players: GameMember[] = [];
  public gameStatus: GameStatus = "waiting_for_players";
  public settings: GameSettings;
  public gameType: GameType;

  public round: Round;
  public roundNumber = 0;

  // For Matchmaking
  private intervalId: NodeJS.Timeout | null = null;
  public timeStart: number = -1;
  public timeEnd: number = -1;
  public onTimerEnd?: () => void;

  public invites: GameInvite[] = [];

  public categoryScores: CategoryUserScore[] = [];
  private winners: string[];

  constructor(
      owner: SocketType | null,
      gameService: GameService,
      gameType: GameType
  ) {
    this.gameService = gameService;

    this.settings = {
      number_of_rounds: 1,
      number_of_questions_per_round: 1,
      number_of_categories_per_voting: 5,
      time_for_answer: 30,
      max_number_of_players: 49,
    };

    this.id = createGameID();
    this.gameType = gameType;

    if (owner) {
      this.owner = new GameMember(owner, this);
      this.owner.socket.join(this.id);
      this.owner.socket.data.gameId = this.id;
    } else {
      this.setTimer(2, this.start.bind(this));
      this.intervalId = setInterval(() => this.tickTimer(), 2000);
    }

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
      owner: this.owner?.getPacket(),
      answersHistory: member.answersHistory,
      player: member.getPacket(),
      round: this.round?.getPacket(member),
      players: this.getAllPlayers().map((player) => player.getPacket()),
      timerEnd: this.timeEnd,
      timerStart: this.timeStart,
      winners: this.winners,
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

    this.gameService.eventEmitter.emit("game_destroyed", this);

    this.logger.log("Game destroyed");
  }

  /**
   * Adds a player to the game and returns the GameMember object
   *
   * @param playerSocket - the socket of the player
   */
  public join(playerSocket: SocketType) {
    if (this.gameStatus !== "waiting_for_players") {
      throw new WsException("Gra już się rozpoczęła!");
    }
    if (this.players.length >= this.settings.max_number_of_players) {
      throw new WsException("Gra jest pełna!");
    }

    const player = new GameMember(playerSocket, this);
    this.players.push(player);
    player.socket.join(this.id);
    player.socket.data.gameId = this.id;

    this.logger.log(`Player ${player.username} joined the game`);
    this.gameService.eventEmitter.emit("game_join", playerSocket);

    this.send();
    // player.sendNotification("Dołączono do gry!");
  }

  public kick(username: string) {
    const player = this.players.find((player) => player.username === username);
    if (!player) {
      return;
    }

    this.gameService.eventEmitter.emit("game_leave", player.socket);

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
    this.logger.log(`Broadcasting notification: ${message}`);
    this.logger.log(`Players: ${this.getAllPlayers()}`);
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
    if (!["leaderboard", "waiting_for_players", "game_over"].includes(this.gameStatus)) {
      return;
    }

    const player = this.getPlayer(playerSocket);
    if (!player) {
      return;
    }

    this.logger.log(`Player ${playerSocket.data.username} has left the game`);

    this.removePlayer(player);
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
    this.gameService.eventEmitter.emit("game_leave", gameMember.socket);

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

    // we need to disconnect the socket when the player was not logged in
    if (!gameMember.socket.data.user?.id) {
      gameMember.socket.disconnect();
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
  }

  async start() {
    this.logger.log("Game started");
    if (this.intervalId) this.clearTimer();
    if (this.gameType === "matchmaking") {
      if (this.players.length < 2) {
        this.broadcastNotification("Za mało graczy, gra kończy się");
        this.endGame();
        return;
      }
    }
    this.nextRound();
  }

  nextRound() {
    this.round = new Round(this);
    this.roundNumber++;
    this.logger.log(`Starting round ${this.roundNumber}`);

    this.round.start();
  }

  public stashLoggedPlayerCategoryScore(player: GameMember) {
    if (player.socket.data.user?.id) {
      const userCategoryScore: CategoryUserScore =
          this.buildCategoryUserScoreObject(player);
      this.categoryScores.push(userCategoryScore);
      this.logger.log("Category scores in stash method", this.categoryScores);
    }
  }

  private buildCategoryUserScoreObject(player: GameMember): CategoryUserScore {
    return {
      categoryId: this.round.chosenCategory.id,
      userId: player.socket.data.user.id,
      score: player.roundScore,
    };
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
      this.round.setTimer(0, this.round.endVoting.bind(this.round));
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

    // If player still has helpers give him 100 point per not used helper
    this.getAllPlayers().forEach((player) => {
      player.availableHelpers.forEach((helper) => {
        if (!this.settings.blackListedHelpers?.includes(helper.name)) {
          player.score += 100;
          log(
              `Player ${player.username} got 100 points for not using ${helper.name}`
          );
        }
      });
    });

    const ranking = this.getAllPlayers().sort((a, b) => b.score - a.score);
    const winners = ranking.filter(
        (player) => player.score === ranking[0].score
    );

    const result = [];
    let currentPlace = 1;
    let previousScore = null;
    let playersAtCurrentPlace = 0;

    ranking.forEach((player) => {
      if (player.score !== previousScore) {
        currentPlace += playersAtCurrentPlace;
        playersAtCurrentPlace = 1;
        previousScore = player.score;
      } else {
        playersAtCurrentPlace++;
      }

      result.push({ player, place: currentPlace });
    });
    this.winners = winners.map((player) => player.username);

    this.broadcastUpdate({
      status: "game_over",
      players: ranking.map((player) => player.getPacket()),
      winners: this.winners,
    });

    this.getAllPlayers().forEach((player) => {
      player.place = result.find((r) => r.player === player)?.place;
    });

    this.logger.log("Game ended");
    this.logger.log(this.categoryScores);
    this.gameService.saveGameToHistory(this);

    if (this.gameType === "matchmaking") {
      this.gameService.removeGame(this);
    }
    setTimeout(() => {
      this.gameService.removeGame(this);
    }, 300000); // after 5 minutes game will be removed and it can't be played again
  }

  getAllPlayers() {
    return [this.owner, ...this.players].filter((player) => {
      if (!player) return false;
      return player;
    });
  }

  getAllLoggedPlayers() {
    return this.getAllPlayers().filter((player) => player.socket.data.user?.id);
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

  changeSettings(settings: Partial<GameSettings>) {
    if (this.gameStatus !== "waiting_for_players") {
      return;
    }

    this.settings = { ...this.settings, ...settings };
    this.broadcastUpdate({
      settings: this.settings,
    });
  }

  changeSettingsHelpers(blackListedHelpers: HelperType[]) {
    if (this.gameStatus !== "waiting_for_players") {
      return;
    }

    this.settings.blackListedHelpers = blackListedHelpers;
    this.broadcastUpdate({
      settings: this.settings,
    });
  }

  changeSettingsCategories(whiteListedCategories: CategoryId[]) {
    if (this.gameStatus !== "waiting_for_players") {
      return;
    }

    this.settings.category_whitelist = whiteListedCategories;

    this.broadcastUpdate({
      settings: this.settings,
    });
  }

  public setTimer(time: number, callback: () => void) {
    time = parseInt(time.toString());

    this.timeStart = Date.now();
    this.timeEnd = this.timeStart + time * 1000;
    this.onTimerEnd = callback;
  }

  public tickTimer() {
    if (this.timeEnd === -1) {
      return;
    }

    if (this.timeEnd <= Date.now()) {
      this.timeEnd = -1;
      this.onTimerEnd();
    }
  }

  private clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}