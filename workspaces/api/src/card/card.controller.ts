import { Body, Controller, Get, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CardService } from './card.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Card } from '@shared/common/Cards';
import { Card as EntityCard } from "@app/entity/card";
import { AddCardDto } from './dtos';
import { Roles } from '@app/roles/roles.decorator';
import { UserRole } from '@app/entity/user';
import { AuthGuard } from '@app/authentification/authentification.guard';
import { RolesGuard } from '@app/roles/roles.guard';


@Controller('card')
export class CardController {

  constructor(private cardService: CardService) { }

  @Post('/csv')
  @UseInterceptors(FileInterceptor('csvFile'))
  async createFromCsv(@UploadedFile() csvFile: Express.Multer.File, @Res() res: Response) {
    try {
      const cards = await this.cardService.parseCsv(csvFile);
      return res.status(200).json({ ok: true, data: cards });
    } catch (error) {
      console.error(error);
    }
  }

  @Post('add')
  @UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async addCard(@Body() addCardDto : AddCardDto) : Promise<EntityCard> {
    return this.cardService.addCard(addCardDto);
	}

  @Get('deck')
  async getDeck(): Promise<Card[]> {
    console.log('getDeck in controller')
    return this.cardService.getDeck();
  }

  @Get('all-cards')
  async getAllCards(){
      return this.cardService.getAllCards();
  }

}
