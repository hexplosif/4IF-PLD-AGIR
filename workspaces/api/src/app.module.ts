import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entity/card';
import { Actor } from './entity/actor';
import { Training_Card } from './entity/training_card';
import { Expert_Card } from './entity/expert_card';
import { Card_Content } from './entity/card_content';
import { Practice_Card } from './entity/practice_card';
import { Best_Practice_Card } from './entity/best_practice_card';
import { Bad_Practice_Card } from './entity/bad_practice_card';
import { Green_IT_Booklet } from './entity/green_it_booklet';
import { Game } from './entity/game';
import { Question } from './entity/question';
import { Question_Content } from './entity/question_content';
import { Question_Answer } from './entity/question_answer';
import { User_Game } from './entity/user_game';
import { User } from './entity/user';
import { CardModule } from './card/card.module';
import { GameModule } from './game/game.module';
import { AuthModule } from './authentification/authentification.module';
import { UsersModule } from './users/users.module';
import { SensibilisationModule } from './sensibilisation/sensibilisation.module';
import { BookletModule } from './booklet/booklet.module';
import { Green_IT_Booklet_Bad_Practice_Card } from './entity/green_it_booklet_bad_practice_card';
import { Green_IT_Booklet_Best_Practice_Card } from './entity/green_it_booklet_best_practice_card';
import { RolesGuard } from './roles/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password : process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_URL,
      entities : [
        Card,
        Actor,
        Training_Card,
        Expert_Card,
        Card_Content,
        Practice_Card,
        Best_Practice_Card, 
        Bad_Practice_Card,
        Green_IT_Booklet,
        Game,
        Question,
        Question_Content,
        Question_Answer,
        User_Game,
        User,
        Green_IT_Booklet_Bad_Practice_Card,
        Green_IT_Booklet_Best_Practice_Card
      ],
      synchronize: true // TODO: to remove this in production (https://docs.nestjs.com/techniques/database)
    }),
    CardModule,
    GameModule,
    AuthModule,
    UsersModule,
    SensibilisationModule,
    BookletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
