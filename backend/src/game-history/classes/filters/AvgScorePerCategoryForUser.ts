import { UserGameCategoryScore } from "src/game/entities/usergamecategoryscore.model";
import { Repository } from "typeorm";
import { ICategoryStatsFilter } from "./ICategoryStatsFilter";
import { CategoryScore } from "@shared/game";

export class AvgScorePerCategoryForUser implements ICategoryStatsFilter {
  constructor(private readonly userId: number) {}
  async filter(
    userGameCategoryScoreRepository: Repository<UserGameCategoryScore>
  ): Promise<CategoryScore[]> {
    const query = `
        SELECT 
            ug.userGameUserId,
            cat.name AS "categoryName",
            AVG(ug.score) AS "averageScore"
        FROM 
            user_game_category_score ug
        INNER JOIN 
            category cat ON cat.id = ug.categoryId
        WHERE 
            ug.userGameUserId = ?
        GROUP BY 
            ug.userGameUserId, cat.name;
    `;

    const results = await userGameCategoryScoreRepository.query(query, [
      this.userId,
    ]);

    return results.map((result) => ({
      category_name: result.categoryName,
      number: Math.round(result.averageScore * 100) / 100,
    }));
  }
}
