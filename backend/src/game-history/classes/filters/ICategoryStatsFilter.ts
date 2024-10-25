import { CategoryScore } from "@shared/game";
import { UserGameCategoryScore } from "src/game/entities/usergamecategoryscore.model";
import { Repository } from "typeorm";

export interface ICategoryStatsFilter {
  filter(
    userGameCategoryScoreRepository: Repository<UserGameCategoryScore>
  ): Promise<CategoryScore[]>;
}
