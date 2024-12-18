import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { QuestionsModule } from "./questions/questions.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Distractor } from "./questions/entities/distractor.model";
import { Question } from "./questions/entities/question.model";
import { QuestionsController } from "./questions/controllers/questions/questions.controller";
import databaseConfig from "./config/database.config";
import { Category } from "./questions/entities/category.model";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RoundModule } from "./round/round.module";
import { AuthUserMiddleware } from "./auth/auth-user.middleware";
import { GameModule } from "./game/game.module";
import { MatchmakingModule } from "./matchmaking/matchmaking.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { FriendsModule } from "./friends/friends.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { GameHistoryModule } from "./game-history/game-history.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([Distractor, Question, Category]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get("database"),
      }),
    }),
    QuestionsModule,
    AuthModule,
    UserModule,
    RoundModule,
    GameModule,
    NotificationsModule,
    FriendsModule,
    MatchmakingModule,
    GameHistoryModule,
  ],
  controllers: [AppController, QuestionsController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUserMiddleware).forRoutes("*");
  }
}
