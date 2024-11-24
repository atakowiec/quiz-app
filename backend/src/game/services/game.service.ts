import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import Game from "../classes/game";
import { GameGateway } from "../gateways/game.gateway";
import { SocketType } from "../game.types";
import {
  GameDatabase, GameSettings,
  GameType,
  UserGameCategoryScoreDatabase,
  UserGameDatabase,
} from "@shared/game";
import { Category } from "../../questions/entities/category.model";
import { QuestionsService } from "../../questions/services/questions.service";
import { ConfigService } from "@nestjs/config";
import { log } from "console";
import { GameMember } from "../classes/game-member";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { GameHistoryService } from "src/game-history/services/game-history.service";
import { CategoryService } from "../../questions/services/category.service";
import { User } from "../../user/user.model";
import { MetricsService } from "../../metrics/services/metrics.service";

@Injectable()
export class GameService {
  readonly games: Game[] = [];
  private readonly logger = new Logger(GameService.name);

  constructor(
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,
    @Inject(forwardRef(() => GameHistoryService))
    private readonly gameHistoryService: GameHistoryService,
    @Inject()
    public readonly questionsService: QuestionsService,
    @Inject()
    public readonly categoryService: CategoryService,
    @Inject()
    public readonly configService: ConfigService,
    @Inject()
    public readonly eventEmitter: EventEmitter2,
    @Inject()
    private readonly metricsService: MetricsService
  ) {
    setInterval(() => this.tickGames(), 1000);
  }

  tickGames() {
    this.games.forEach((game) => game.tick());
  }

  public createGame(owner: SocketType | null, gameType: GameType) {
    this.eventEmitter.emit("game_join", owner);

    const game = new Game(owner, this, gameType);
    this.games.push(game);

    this.metricsService.incrementGameCreated();
    this.metricsService.setActiveGamesCount(this.games.length);

    return game;
  }

  @OnEvent("user.icon_changed")
  public onUserIconChanged(user: User, iconColor: string) {
    this.getGameByUsername(user.username)?.onUserIconChanged(user, iconColor);
  }

  public getGameById(id: string): Game {
    return this.games.find((game) => game.id === id);
  }

  public removeGame(game: Game) {
    const index = this.games.indexOf(game);
    if (index !== -1) {
      this.games.splice(index, 1);
      this.metricsService.setActiveGamesCount(this.games.length);
    }
    game.destroy();
  }

  public getGameByUsername(username: string): Game {
    return this.games.find(
      (game) =>
        game.owner?.username === username ||
        game.players.some((player) => player.username === username)
    );
  }

  public getMemberByName(username: string): GameMember {
    for (const game of this.games) {
      if (game.owner?.username === username) {
        return game.owner;
      }
      const player = game.players.find(
        (player) => player.username === username
      );
      if (player) {
        return player;
      }
    }
    return null;
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
    return await this.categoryService.getCategories();
  }

  public getAllGames() {
    // I don't know if this endpoint is needed but for now it will return game packet like this because GamePacket is now member based
    log("Games: ", this.games);
  }

  public getAllSockets() {
    return JSON.stringify(
      Array.from(this.gameGateway.server.sockets.sockets.values()).map(
        (socket) => socket.data.username
      )
    );
  }

  public getLengthOfTheQueue() {
    return this.gameGateway.server.sockets.adapter.rooms.get("queue").size;
  }

  public getPlayersFromQueue(): SocketType[] {
    return Array.from(
      this.gameGateway.server.sockets.adapter.rooms.get("queue").values()
    ).map((id) => this.gameGateway.server.sockets.sockets.get(id));
  }

  public async saveGameToHistory(game: Game) {
    const gameObj = this.getGameDatabaseObject(game);
    await this.gameHistoryService.addGameToHistory(gameObj);

    const userGameObjs = game.getAllLoggedPlayers().map((member) => {
      return this.getUserGameDatabaseObject(game, member);
    });

    const userGameCategoryScores: UserGameCategoryScoreDatabase[] =
      this.getUserGameCategoryScoreDatabaseObject(game);

    await this.gameHistoryService.addUserGameResults(userGameObjs);

    this.logger.log(
      "UserGameCategoryScores: ",
      userGameCategoryScores,
      game.categoryScores
    );
    await this.gameHistoryService.addUserGameCategoryScores(
      userGameCategoryScores
    );
    game.getAllLoggedPlayers().forEach((member) => {
      this.gameHistoryService.checkIfAverageScoreHasChanged(
        member.socket.data.user.id
      );
    });
  }

  private getGameDatabaseObject(game: Game): GameDatabase {
    return {
      id: game.id,
      gameType: game.gameType,
      dateTime: new Date(),
    };
  }

  private getUserGameDatabaseObject(
    game: Game,
    member: GameMember
  ): UserGameDatabase {
    return {
      gameId: game.id,
      userId: member.socket.data.user.id,
      score: member.score,
      place: member.place,
    };
  }

  public incrementNumberOfEndedGamesMetric() {
    this.metricsService.incrementGameFinished();
  }

  private getUserGameCategoryScoreDatabaseObject(
    game: Game
  ): UserGameCategoryScoreDatabase[] {
    return game.categoryScores.map((categoryScore) => {
      return {
        userGameGameId: game.id,
        userGameUserId: categoryScore.userId,
        categoryId: categoryScore.categoryId,
        score: categoryScore.score,
      };
    });
  }

  getDefaultGameSettings(): GameSettings {
    return {
      number_of_rounds: parseInt(this.configService.get("DEFAULT_NUMBER_OF_ROUNDS")) ?? 5,
      number_of_questions_per_round: parseInt(this.configService.get("DEFAULT_QUESTIONS_PER_ROUND")) ?? 5,
      number_of_categories_per_voting: parseInt(this.configService.get("DEFAULT_CATEGORIES_PER_VOTING")) ?? 10,
      time_for_answer: parseInt(this.configService.get("DEFAULT_TIME_FOR_ANSWER")) ?? 20,
      max_number_of_players: parseInt(this.configService.get("MAX_PLAYERS")) ?? 49,
    }
  }
}
