import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entity/user';
import { Green_IT_Booklet } from '@app/entity/green_it_booklet';
import { BookletModule } from '@app/booklet/booklet.module';
import { UsersController } from './users.controller';
import { User_Game } from '@app/entity/user_game';
import { Game } from '@app/entity/game';
import { AuthModule } from '@app/authentification/authentification.module';
import { AuthService } from '@app/authentification/authentification.service';
import { forwardRef } from '@nestjs/common';
import { Green_IT_Booklet_Best_Practice_Card } from '@app/entity/green_it_booklet_best_practice_card';
import { Green_IT_Booklet_Bad_Practice_Card } from '@app/entity/green_it_booklet_bad_practice_card';

@Module({
  imports: [
    BookletModule,
    TypeOrmModule.forFeature([User, Green_IT_Booklet, User_Game, Game, Green_IT_Booklet_Best_Practice_Card, Green_IT_Booklet_Bad_Practice_Card]), 
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

