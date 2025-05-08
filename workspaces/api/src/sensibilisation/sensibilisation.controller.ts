import { Body, Controller, Get, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SensibilisationService } from './sensibilisation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from "@app/authentification/authentification.guard";
import { RolesGuard } from "@app/roles/roles.guard";
import { Roles } from "@app/roles/roles.decorator";
import { UserRole } from "@app/entity/user";
import { Question as EntityQuestion } from "@app/entity/question"
import { QuestionDto, QuestionResponse } from "@app/sensibilisation/dtos";

@Controller('sensibilisation')
export class SensibilisationController {
    constructor(private sensibilisationService : SensibilisationService){}

    @Post('/csv')
    @UseInterceptors(FileInterceptor('csvFile'))
    async createFromCsv(@UploadedFile() csvFile : Express.Multer.File, @Res() res: Response){
        const quizz = await this.sensibilisationService.parseCsv(csvFile);
        return res.status(200).json({ ok: true, data: quizz });
    }

    @Post('add')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async addQuestion(@Body() addQuestionDto : QuestionDto) : Promise<QuestionResponse> {
        return this.sensibilisationService.addQuestion(addQuestionDto);
    }

    @Post('update')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateQuestion(@Query('id') id: number, @Body() updateQuestionDto : QuestionDto) : Promise<QuestionResponse> {
        return this.sensibilisationService.updateQuestionById(id, updateQuestionDto);
    }

    @Get('all-questions')
    async getAllQuestions(){
        return this.sensibilisationService.getAllQuizz();
    }

    @Get('data')
    async getData(@Query('id') id: number) : Promise<QuestionResponse> {
        return this.sensibilisationService.getSensibilisationQuizzById(id);
    }
}

