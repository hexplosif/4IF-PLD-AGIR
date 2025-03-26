import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto, UsersTokenDto } from './dtos';


@Controller('users')
export class UsersController {
    constructor(private usersService : UsersService){}
    @HttpCode(HttpStatus.OK)
    @Get('/getBooklet')
    getBooklet(@Query() UsersTokenDto: UsersTokenDto){
        return this.usersService.getBooklet(UsersTokenDto.token);
    
    }

    @Get('nbGames')
    getNbGames(@Query() query: UsersTokenDto) {
        if (query.token==undefined) {
            console.log("[users.controller] getNbGames. Token undefined");
        }
        return this.usersService.getNbGames(query.token);
    }

    @Get('gamesJoined')
    getGamesJoined(@Query() query: UsersTokenDto) {
        if (query.token==undefined) {
            console.log("[users.controller] getGamesJoined. Token undefined");
        }
        return this.usersService.getGamesJoined(query.token);
    }

    @Get('nbVictories')
    getVictories(@Query() UsersTokenDto: UsersTokenDto){
        if (UsersTokenDto.token==undefined) {
            console.log("[users.controller] nbVictory. Token undefined");
        }
        return this.usersService.getVictories(UsersTokenDto.token);
    }

    @Get('totalCO2Saved')
    getTotalCO2Saved(@Query() UsersTokenDto: UsersTokenDto){
        if (UsersTokenDto.token==undefined) {
            console.log("[users.controller] totalCO2Saved. Token undefined");
        }
        return this.usersService.getTotalCO2Saved(UsersTokenDto.token);
    }

    @Get('nbGreenITPractices')
    getNbGreenITPractices(@Query() UsersTokenDto: UsersTokenDto){
        if (UsersTokenDto.token==undefined) {
            console.log("[users.controller] nbGreenITPractices. Token undefined");
        }
        return this.usersService.getNbGreenITPractices(UsersTokenDto.token);
    }	

    @Get('nbMauvaisePratice')
    getNbMauvaisePratice(@Query() UsersTokenDto: UsersTokenDto){
        if (UsersTokenDto.token==undefined) {
            console.log("[users.controller] nbMauvaisePractices. Token undefined");
        }
        return this.usersService.getNbMauvaisePratice(UsersTokenDto.token);
    }

}




