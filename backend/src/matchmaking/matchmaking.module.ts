import { forwardRef, Module } from "@nestjs/common";
import { MatchmakingService } from "./services/matchmaking.service";
import { GameService } from "src/game/services/game.service";
import { GameModule } from "src/game/game.module";

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [MatchmakingService],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
