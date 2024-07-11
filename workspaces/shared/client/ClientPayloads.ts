import { PracticeAnswer, PracticeAnswerType, SensibilisationQuestion, SensibilisationQuestionAnswer } from '@shared/common/Game';
import { ClientEvents } from './ClientEvents';
import { Card } from '../common/Cards';
import { DrawMode } from '@shared/server/types';

export type ClientPayloads = {
  [ClientEvents.Ping]: {
    message: string;
  };

  [ClientEvents.LobbyCreate]: {
    playerName: string;
    co2Quantity: number;
    ownerId: string;
  }

  [ClientEvents.LobbyJoin]: {
    connectionCode: string;
    playerName: string;
    playerId: string;
  }

  [ClientEvents.LobbyLeave]: {

  }

  [ClientEvents.LobbyStartGame]: {
    clientInGameId: string;
  }

  [ClientEvents.AnswerPracticeQuestion]: {
    cardId: string;
    answer: PracticeAnswerType;
    cardType: 'BestPractice' | 'BadPractice';
  }

  [ClientEvents.AnswerSensibilisationQuestion]: {
    questionId: number;
    answer: SensibilisationQuestionAnswer | null;
  }


  [ClientEvents.GetSensibilisationQuestion]: {
  }

  [ClientEvents.PlayCard]: {
    card: Card;
  }
  
  [ClientEvents.DiscardCard]: {
    card: Card;
  }

  [ClientEvents.playerDisconnected] : {
    playerId : string;
    message: string;
  }

  [ClientEvents.ClientReconnect]: {
    clientInGameId: string;
  }

  [ClientEvents.DrawModeChoice]: {
    drawMode: DrawMode; 
  }
};
