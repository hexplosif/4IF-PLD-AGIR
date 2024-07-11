import { Module } from "@nestjs/common";
import { BookletService } from "./booklet.service";
import { BookletController } from "./booklet.controller";
import { Green_IT_Booklet } from "@app/entity/green_it_booklet";
import { UsersModule } from "@app/users/users.module";
import { User_Game } from "@app/entity/user_game";
import { User } from "@app/entity/user";
import { Game } from "@app/entity/game";
import { forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CardService } from "@app/card/card.service";
import { Card } from "@app/entity/card";
import { Best_Practice_Card } from "@app/entity/best_practice_card";
import { Bad_Practice_Card } from "@app/entity/bad_practice_card";
import { Expert_Card } from "@app/entity/expert_card";
import { Training_Card } from "@app/entity/training_card";
import { Card_Content } from "@app/entity/card_content";
import { Actor } from "@app/entity/actor";

@Module({
  imports: [
    TypeOrmModule.forFeature([Green_IT_Booklet, User, User_Game, Game, Card, Best_Practice_Card, Bad_Practice_Card, Expert_Card, Training_Card, Card_Content, Actor]),
    forwardRef(() => UsersModule),
  ],
  providers: [BookletService, CardService],
  controllers: [BookletController],
})
export class BookletModule {}
