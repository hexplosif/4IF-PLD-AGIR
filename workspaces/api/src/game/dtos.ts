import { PracticeAnswer, SensibilisationQuestionAnswer } from '@shared/common/Game';
import { CardType } from '@shared/common/Cards';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class LobbyCreateDto {
  @IsString()
  playerName: string;

  @IsNumber()
  @Min(500)
  @Max(1000)
  co2Quantity: number;

  @IsString()
  ownerId: string;
}

export class LobbyJoinDto {
  @IsString()
  connectionCode: string;

  @IsOptional()
  @IsString()
  clientInGameId: string;

  @IsString()
  playerName: string;
}

export class ClientStartGameDto {
  @IsString()
  clientInGameId: string;
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



