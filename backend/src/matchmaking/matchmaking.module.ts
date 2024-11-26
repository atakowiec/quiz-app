import { forwardRef, Module } from "@nestjs/common";
import { MatchmakingService } from "./services/matchmaking.service";
import { GameModule } from "src/game/game.module";

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [MatchmakingService],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
