import { DrawMode, PracticeAnswerType, SensibilisationQuestionAnswer } from '@shared/common/Game';
import { ClientEvents } from './ClientEvents';
import { Card, CardType } from '../common/Cards';

export type ClientPayloads = {
  [ClientEvents.AcknowledgeAnimation]: {}

  [ClientEvents.LobbyCreate]: {
    playerName: string;
    gameName: string;
    co2Quantity: number;
    ownerToken: string;
    playerLanguage: string;
  }

  [ClientEvents.LobbyJoin]: {
    connectionCode: string;
    playerName: string;
    playerToken: string;
    clientInGameId?: string;
    playerLanguage: string;
  }

  [ClientEvents.LobbyLeave]: {}

  [ClientEvents.LobbyStartGame]: {
    clientInGameId: string;
    gameName: string;
  }

  [ClientEvents.LobbyChangeLanguage]: {
    playerLanguage: string;
  }

  [ClientEvents.AnswerPracticeQuestion]: {
    cardId: string;
    answer: PracticeAnswerType;
    cardType: CardType
  }

  [ClientEvents.AnswerSensibilisationQuestion]: {
    questionId: number;
    answer: SensibilisationQuestionAnswer | null;
  }

  [ClientEvents.PlayCard]: {
    card: Card;
    targetPlayerId?: string;
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
