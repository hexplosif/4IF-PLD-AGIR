import { Body, Controller, HttpCode, HttpStatus, Post, Get, Param, Query } from '@nestjs/common';
import { BookletService } from './booklet.service';
import { BookletDto } from './dtos';
import { CardService } from '../card/card.service';

@Controller('booklet')
export class BookletController {
    constructor(private bookletService: BookletService, private cardService : CardService){}

    @HttpCode(HttpStatus.OK)
    @Post('/create')
    createBooklet(@Body() bookletDto: BookletDto){
        return this.bookletService.createBooklet(parseInt(bookletDto.user_id));
    }

    @Get('get')
    getBooklet(@Body() bookletDto: BookletDto){
        return this.bookletService.getBooklet(parseInt(bookletDto.user_id));
    }

    @Get('/banned-practices')
    async getBannedPractices(@Query() bookletDto: BookletDto){
        console.log('[booklet controller] getBannedPractices in controller', bookletDto)
        return this.bookletService.getBannedPractices(parseInt(bookletDto.user_id));
    }

    @Get('/applied-practices')
    async getAppliedPractices(@Query() bookletDto: BookletDto){
        console.log('[booklet controller] getAppliedPractices in controller', bookletDto)
        return this.bookletService.getAppliedPractices(parseInt(bookletDto.user_id));   
    }

    @Get('/bad-practice-details')
    async getBadPracticeCardDetails() {
        console.log('[booklet controller] getBadPracticeCardDetails in controller')
        return this.cardService.getBadPracticeCardDetails();
    }

    @Get('/good-practice-details')
    async getGoodPracticeCardDetails() {
        console.log('[booklet controller] getGoodPracticeCardDetails in controller')
        return this.cardService.getBestPracticeCardDetails();
    }
}
