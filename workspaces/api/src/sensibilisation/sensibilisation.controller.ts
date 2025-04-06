import { Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SensibilisationService } from './sensibilisation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('sensibilisation')
export class SensibilisationController {
    constructor(private sensibilisationService : SensibilisationService){}

    @Post('/csv')
    @UseInterceptors(FileInterceptor('csvFile'))
    async createFromCsv(@UploadedFile() csvFile : Express.Multer.File, @Res() res: Response){
        const quizz = await this.sensibilisationService.parseCsv(csvFile);
        return res.status(200).json({ ok: true, data: quizz });
    }
}

