import { forwardRef, Module } from "@nestjs/common";
import { GameService } from "./services/game.service";
import { GameGateway } from "./gateways/game.gateway";
import { AuthModule } from "src/auth/auth.module";
import { GameController } from "./game.controller";
import { QuestionsModule } from "../questions/questions.module";
import { MatchmakingModule } from "src/matchmaking/matchmaking.module";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    QuestionsModule,
    forwardRef(() => MatchmakingModule),
  ],
  providers: [GameService, GameGateway],
  controllers: [GameController],
  exports: [GameService, GameGateway],
})
export class GameModule {}
