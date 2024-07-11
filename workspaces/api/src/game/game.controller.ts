import { Body, Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dtos';
import { create } from 'domain';

@Controller('game')
export class GameController {

    constructor(private gameService: GameService) { }

    @Post('/createGame')
    async createGame(@Body() CreateGameDto: CreateGameDto){
        return this.gameService.createGame(CreateGameDto.winnerId);
    }
  
}
