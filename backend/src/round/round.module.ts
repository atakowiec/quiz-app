import { Module } from "@nestjs/common";
import { RoundService } from "./services/round.service";
import { RoundController } from "./controllers/round.controller";
import { QuestionsService } from "src/questions/services/questions/questions.service";
import { QuestionsModule } from "src/questions/questions.module";

@Module({
  imports: [QuestionsModule],
  providers: [RoundService],
  controllers: [RoundController],
})
export class RoundModule {}
