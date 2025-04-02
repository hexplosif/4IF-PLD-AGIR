import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { CardModule } from '@app/card/card.module';
import { SensibilisationModule } from '@app/sensibilisation/sensibilisation.module';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '@app/entity/card';
import { Game } from '@app/entity/game';
import { Actor } from '@app/entity/actor';
import { User_Game } from '@app/entity/user_game';
import { Bad_Practice_Card } from '@app/entity/bad_practice_card';
import { Expert_Card } from '@app/entity/expert_card';
import { Best_Practice_Card } from '@app/entity/best_practice_card';
import { Green_IT_Booklet} from "@app/entity/green_it_booklet";
import { User } from '@app/entity/user';
import { AuthModule } from '@app/authentification/authentification.module';
import { Training_Card } from '@app/entity/training_card';
import { Green_IT_Booklet_Bad_Practice_Card } from '@app/entity/green_it_booklet_bad_practice_card';
import { Green_IT_Booklet_Best_Practice_Card } from '@app/entity/green_it_booklet_best_practice_card';


@Module({
  imports: [
    CardModule,
    SensibilisationModule,
    TypeOrmModule.forFeature([Card]),
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([Actor]),
    TypeOrmModule.forFeature([User_Game]),
    TypeOrmModule.forFeature([Bad_Practice_Card]),
    TypeOrmModule.forFeature([Best_Practice_Card]),
    TypeOrmModule.forFeature([Expert_Card]),
    TypeOrmModule.forFeature([Green_IT_Booklet]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Training_Card]),
    TypeOrmModule.forFeature([Green_IT_Booklet_Bad_Practice_Card]),
    TypeOrmModule.forFeature([Green_IT_Booklet_Best_Practice_Card]),
    AuthModule,
  ],
  providers: [
    GameGateway,
    LobbyManager,
    GameService,
  ],
  exports: [GameService],
  
})
export class GameModule {}
