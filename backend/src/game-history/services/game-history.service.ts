import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CategoryScore,
  GameDatabase,
  GameHistoryPlayerItem,
  ProfileStats,
  UserGameCategoryScoreDatabase,
  UserGameDatabase,
} from "@shared/game";
import { GameHistory } from "src/game/entities/gamehistory.model";
import { UserGame } from "src/game/entities/usergame.model";
import { UserGameCategoryScore } from "src/game/entities/usergamecategoryscore.model";
import { GameService } from "src/game/services/game.service";
import { Repository } from "typeorm";
import { ICategoryStatsFilter } from "../classes/filters/ICategoryStatsFilter";
import { AvgHistory } from "src/game/entities/avghistory.model";
import { log } from "console";

@Injectable()
export class GameHistoryService {
  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    @InjectRepository(GameHistory)
    public gameRepository: Repository<GameHistory>,
    @InjectRepository(UserGame)
    private userGameRepository: Repository<UserGame>,
    @InjectRepository(UserGameCategoryScore)
    private userGameCategoryScoreRepository: Repository<UserGameCategoryScore>,
    @InjectRepository(AvgHistory)
    private avgHistoryRepository: Repository<AvgHistory>
  ) { }

  async getGameHistory(gameId: string): Promise<GameHistory> {
    return this.gameRepository.findOne({
      where: { id: gameId },
      relations: [
        "userGames",
        "userGames.user",
        "userGames.categoryScores",
        "userGames.categoryScores.category",
      ],
    });
  }

  async getUserGameHistory(userId: number): Promise<GameHistoryPlayerItem[]> {
    const userGames = await this.userGameRepository.find({
      where: { userId },
      relations: ["game", "categoryScores", "categoryScores.category"],
      take: 10,
    });

    return this.mapUserGamesToHistory(userGames);
  }

  private mapUserGamesToHistory(
    userGames: UserGame[]
  ): GameHistoryPlayerItem[] {
    return userGames.map(({ place, score, game }) => ({
      place,
      gameType: game.gameType,
      score,
      dateTime: game.dateTime,
    }));
  }

  async getGameLeaderboard(gameId: string): Promise<UserGame[]> {
    return this.userGameRepository.find({
      where: { gameId },
      order: { score: "DESC" },
      relations: ["user"],
    });
  }

  async addGameToHistory(game: GameDatabase): Promise<GameHistory> {
    const gameEntity = this.gameRepository.create(game);
    return this.gameRepository.save(gameEntity);
  }

  async addUserGameResult(userGameResult: UserGameDatabase): Promise<UserGame> {
    const userGame = this.userGameRepository.create(userGameResult);
    return this.userGameRepository.save(userGame);
  }

  async addUserGameCategoryScore(
    categoryScore: UserGameCategoryScoreDatabase
  ): Promise<UserGameCategoryScore> {
    const userGameCategoryScore =
      this.userGameCategoryScoreRepository.create(categoryScore);
    return this.userGameCategoryScoreRepository.save(userGameCategoryScore);
  }

  async addUserGameResults(userGameResults: UserGameDatabase[]) {
    const userGames = this.userGameRepository.create(userGameResults);
    return this.userGameRepository.save(userGames);
  }

  async addUserGameCategoryScores(
    categoryScores: UserGameCategoryScoreDatabase[]
  ) {
    const userGameCategoryScores =
      this.userGameCategoryScoreRepository.create(categoryScores);
    return this.userGameCategoryScoreRepository.save(userGameCategoryScores);
  }

  async getUserStats(userId: number): Promise<ProfileStats | UserGame[]> {
    const query = `
    SELECT 
      COUNT(*) as "gamesPlayed",
      SUM(CASE WHEN userGame.place = 1 THEN 1 ELSE 0 END) as "firstPlace",
      SUM(CASE WHEN userGame.place = 2 THEN 1 ELSE 0 END) as "secondPlace",
      SUM(CASE WHEN userGame.place = 3 THEN 1 ELSE 0 END) as "thirdPlace",
      SUM(userGame.score) as "totalScore",
      AVG(userGame.score) as "averageScore",
      MAX(userGame.score) as "maxScore"
    FROM user_game userGame
    INNER JOIN game_history ON userGame.gameId = game_history.id
    WHERE userGame.userId = ?
    AND game_history.gameType != "jednoosobowy"
  `;

    // Execute the query and cast the result to ProfileStats
    const result = await this.userGameRepository.query(query, [userId]);
    const profileStats: ProfileStats = result[0];

    profileStats.rankingPlaces = [
      {
        place: "I Miejsce",
        count: profileStats.firstPlace,
        unit: this.getUnitByNumberOfGames(profileStats.firstPlace),
        percentage: this.roundToTwoDecimals(
          profileStats.firstPlace / profileStats.gamesPlayed
        ),
      },
      {
        place: "II Miejsce",
        count: profileStats.secondPlace,
        unit: this.getUnitByNumberOfGames(profileStats.secondPlace),
        percentage: this.roundToTwoDecimals(
          profileStats.secondPlace / profileStats.gamesPlayed
        ),
      },
      {
        place: "III Miejsce",
        count: profileStats.thirdPlace,
        unit: this.getUnitByNumberOfGames(profileStats.thirdPlace),
        percentage: this.roundToTwoDecimals(
          profileStats.thirdPlace / profileStats.gamesPlayed
        ),
      },
    ];

    profileStats.averageScore =
      Math.round(profileStats.averageScore * 100) / 100;

    return profileStats;
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

  getUnitByNumberOfGames(count: number): string {
    if (count === 1) {
      return "gra";
    } else if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
    ) {
      return "gry";
    }
    return "gier";
  }

  async getCategoryStatistics(
    filter: ICategoryStatsFilter
  ): Promise<CategoryScore[]> {
    return filter.filter(this.userGameCategoryScoreRepository);
  }

  async calculateAverageScore(userId: number): Promise<number> {

    const query = `
    SELECT 
      AVG(userGame.score) as "averageScore"
    FROM user_game userGame
    WHERE userGame.userId = ?
    GROUP BY userGame.userId
  `;

    const result = await this.userGameRepository.query(query, [userId]);

    return result[0].averageScore;
  }

  async checkIfAverageScoreHasChanged(userId: number) {
    const newAvgScore = await this.calculateAverageScore(userId);
    const avgHistory = await this.avgHistoryRepository.findOne({
      where: { userId },
      order: { createdAt: "DESC" },
    });
    if (!avgHistory || avgHistory.avgScore !== newAvgScore) {
      this.addNewAverageScoreToHistory(userId, newAvgScore);
    }

  }

  async addNewAverageScoreToHistory(userId: number, avgScore: number) {
    const avgHistory = this.avgHistoryRepository.create({
      userId,
      avgScore,
    });
    await this.avgHistoryRepository.save(avgHistory);
  }

  async getUserAverageHistory(userId: number): Promise<AvgHistory[]> {
    return this.avgHistoryRepository.find({
      where: { userId },
      order: { createdAt: "ASC" },
    });
  }  

}
