import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from '@app/entity/card';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Best_Practice_Card } from '@app/entity/best_practice_card';
import { Bad_Practice_Card } from '@app/entity/bad_practice_card';
import { Training_Card } from '@app/entity/training_card';
import { Expert_Card } from '@app/entity/expert_card';
import { Card_Content } from '@app/entity/card_content';
import { Actor } from '@app/entity/actor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    TypeOrmModule.forFeature([Best_Practice_Card]),
    TypeOrmModule.forFeature([Bad_Practice_Card]),
    TypeOrmModule.forFeature([Training_Card]),
    TypeOrmModule.forFeature([Expert_Card]),
    TypeOrmModule.forFeature([Card_Content]),
    TypeOrmModule.forFeature([Actor]),
  ],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
