import { forwardRef, Module } from "@nestjs/common";
import { GameService } from "./services/game.service";
import { GameGateway } from "./gateways/game.gateway";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [GameService, GameGateway],
  exports: [GameService],
})
export class GameModule {}
