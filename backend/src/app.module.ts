import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { QuestionsModule } from "./questions/questions.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Distractor } from "./questions/entities/distractor.model";
import { Question } from "./questions/entities/question.model";
import { QuestionsController } from "./questions/controllers/questions/questions.controller";
import databaseConfig from "./config/database.config";
import { Category } from "./questions/entities/category.model";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forFeature([Distractor, Question, Category]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get("database"),
      }),
    }),
    QuestionsModule,
  ],
  controllers: [AppController, QuestionsController],
  providers: [AppService],
})
export class AppModule {}
