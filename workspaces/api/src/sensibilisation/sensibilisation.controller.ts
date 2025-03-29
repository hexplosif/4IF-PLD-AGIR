import { Controller, Post, Res, UploadedFile, UseInterceptors,Body, HttpStatus, HttpCode } from '@nestjs/common';
import { SensibilisationService } from './sensibilisation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('sensibilisation')
export class SensibilisationController {
    constructor(private sensibilisationService : SensibilisationService){}
    
    @HttpCode(HttpStatus.OK)
    @Post('/csv')
    @UseInterceptors(FileInterceptor('csvFile'))
    async createFromCsv(@UploadedFile() csvFile : Express.Multer.File, @Res() res: Response){
        return await this.sensibilisationService.parseCsv(csvFile);
    }
}

