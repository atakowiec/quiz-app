import { forwardRef, Module } from "@nestjs/common";
import { GameHistoryService } from "./services/game-history.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameHistory } from "src/game/entities/gamehistory.model";
import { UserGame } from "src/game/entities/usergame.model";
import { UserGameCategoryScore } from "src/game/entities/usergamecategoryscore.model";
import { GameModule } from "src/game/game.module";
import { GameHistoryController } from "./controllers/game-history.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([GameHistory, UserGame, UserGameCategoryScore]),
    forwardRef(() => GameModule),
  ],
  controllers: [GameHistoryController],
  providers: [GameHistoryService],
  exports: [GameHistoryService],
})
export class GameHistoryModule {}
