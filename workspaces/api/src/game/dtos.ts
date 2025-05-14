import { PracticeAnswer, SensibilisationQuestionAnswer } from '@shared/common/Game';
import { CardType } from '@shared/common/Cards';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import {MIN_CO2_QUANTITY, MAX_CO2_QUANTITY} from '@shared/common/constants';

export class LobbyCreateDto {
  @IsString()
  playerName: string;

  @IsNumber()
  @Min(MIN_CO2_QUANTITY)
  @Max(MAX_CO2_QUANTITY)
  co2Quantity: number;
  gameName: string;
  @IsString()
  ownerToken: string;

  @IsString()
  playerLanguage: string;
}

export class LobbyJoinDto {
  @IsString()
  connectionCode: string;

  @IsOptional()
  @IsString()
  clientInGameId: string;

  @IsString()
  playerName: string;

  @IsString()
  playerToken: string;

  @IsString()
  playerLanguage: string;
}

export class ClientStartGameDto {
  @IsString()
  clientInGameId: string;
}

export class ClientChangeLanguageDto {
  @IsString()
  playerLanguage: string;
}

export class PracticeAnswerDto {
  @IsString()
  cardId: string;

  @IsString()
  answer: PracticeAnswer;

  cardType: CardType;
}


export class SensibilisationAnswerDto {
  @IsNumber()
  questionId: number;

  answer: SensibilisationQuestionAnswer | null;
}

export class ClientReconnectDto {
  @IsString()
  clientToken: string;

  @IsString()
  clientInGameId: string;

  // See later if this will be useful, on how we can send back messages to the disconnect/reconnect client
  @IsNumber()
  lastMessageReceived: number;
}

export class CreateGameDto{
  @IsNumber()
  winnerId: number;
  //clientId: number;

}



