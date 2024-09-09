import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {QuestionsModule} from './questions/questions.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Question} from "./questions/question.model";
import {Category} from "./questions/category.model";
import {Distractor} from "./questions/distractor.model";
import {Repository} from "typeorm";
import { QuestionController } from './question/question.controller';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Distractor, Question]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [Question, Category, Distractor],
        synchronize: configService.get<string>('DB_SYNC') === 'true',
      })
    }), QuestionsModule],
  controllers: [AppController, QuestionController],
  providers: [AppService],
})
export class AppModule {
}
