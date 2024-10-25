import { Repository } from "typeorm";
import { ICategoryStatsFilter } from "./ICategoryStatsFilter";
import { UserGameCategoryScore } from "src/game/entities/usergamecategoryscore.model";
import { CategoryScore } from "@shared/game";

export class CountGamesPerCategoryForUser implements ICategoryStatsFilter {
  constructor(private readonly userId: number) {}
  async filter(
    userGameCategoryScoreRepository: Repository<UserGameCategoryScore>
  ): Promise<CategoryScore[]> {
    const query = `
            SELECT 
                cat.name AS "categoryName",
                COUNT(ug.userGameGameId) AS "gameCount"
            FROM 
                user_game_category_score ug
            INNER JOIN 
                category cat ON cat.id = ug.categoryId
            WHERE 
                ug.userGameUserId = ?
            GROUP BY 
                cat.name;
            `;

    const results = await userGameCategoryScoreRepository.query(query, [
      this.userId,
    ]);

    return results.map((result) => ({
      category_name: result.categoryName,
      number: result.gameCount,
    }));
  }
}
