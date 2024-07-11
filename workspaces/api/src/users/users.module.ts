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


@Module({
  imports: [
    BookletModule,
    TypeOrmModule.forFeature([User, Green_IT_Booklet, User_Game, Game]), 
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

