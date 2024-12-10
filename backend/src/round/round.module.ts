import { Module } from "@nestjs/common";
import { RoundService } from "./services/round.service";
import { QuestionsModule } from "src/questions/questions.module";

@Module({
  imports: [QuestionsModule],
  providers: [RoundService],
})
export class RoundModule {}
