import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppService } from "./app.service";
import { QuestionsModule } from "./questions/questions.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import databaseConfig from "./config/database.config";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RoundModule } from "./round/round.module";
import { AuthUserMiddleware } from "./auth/middlewares/auth-user.middleware";
import { GameModule } from "./game/game.module";
import { MatchmakingModule } from "./matchmaking/matchmaking.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { FriendsModule } from "./friends/friends.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { GameHistoryModule } from "./game-history/game-history.module";
import { ColorsModule } from "./colors/colors.module";

import { MetricsModule } from "./metrics/metrics.module";
import { Question } from "./questions/entities/question.model";
import { Category } from "./questions/entities/category.model";
import { Distractor } from "./questions/entities/distractor.model";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get("database"),
      }),
    }),
    TypeOrmModule.forFeature([
      Question, Category, Distractor
    ]),
    EventEmitterModule.forRoot(),
    QuestionsModule,
    AuthModule,
    UserModule,
    RoundModule,
    GameModule,
    NotificationsModule,
    FriendsModule,
    MatchmakingModule,
    GameHistoryModule,
    ColorsModule,
    MetricsModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUserMiddleware).forRoutes("*");
  }
}
