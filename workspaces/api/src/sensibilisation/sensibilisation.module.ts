import { forwardRef, Module } from '@nestjs/common';
import { SensibilisationController } from './sensibilisation.controller';
import { SensibilisationService } from './sensibilisation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '@app/entity/question';
import { Question_Content } from '@app/entity/question_content';
import { AuthModule } from "@app/authentification/authentification.module";

@Module({
  
  imports : [
    TypeOrmModule.forFeature([Question]),
    TypeOrmModule.forFeature([Question_Content]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SensibilisationController, SensibilisationController],
  providers: [SensibilisationService],
  exports: [SensibilisationService],
  
})
export class SensibilisationModule {}

