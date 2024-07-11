import { Module } from '@nestjs/common';
import { SensibilisationController } from './sensibilisation.controller';
import { SensibilisationService } from './sensibilisation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '@app/entity/question';
import { Question_Answer } from '@app/entity/question_answer';
import { Question_Content } from '@app/entity/question_content';

@Module({
  
  imports : [
    TypeOrmModule.forFeature([Question]),
    TypeOrmModule.forFeature([Question_Answer]),
    TypeOrmModule.forFeature([Question_Content])
  ],
  controllers: [SensibilisationController, SensibilisationController],
  providers: [SensibilisationService],
  exports: [SensibilisationService],
  
})
export class SensibilisationModule {}

