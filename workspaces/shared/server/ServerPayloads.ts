import { GameState, PlayerStateInterface, SensibilisationQuestion } from '../common/Game';
import { ServerEvents } from './ServerEvents';
import { Card } from '../common/Cards';
import { CardAction } from './types';

export type ServerPayloads = {
  [ServerEvents.Pong]: {
    message: string;
  };

  [ServerEvents.LobbyJoined]: {
    clientInGameId: string;
  }

  [ServerEvents.LobbyState]: {
    lobbyId: string;
    connectionCode: string;
    co2Quantity: number;
    ownerId: string;
    gameName: string;
    // A Record from id to playerName
    clientsNames: Record<string, string>;
  };

  [ServerEvents.GameStart]: {
    gameState: GameState;
  };

  [ServerEvents.GameState]: GameState;

  [ServerEvents.PracticeAnswered]: {};

  [ServerEvents.PlayerCardAction]: {
    playerStates: Record<string, PlayerStateInterface>;
    playerId: string;
    card: Card;
    action: CardAction;
  };
  
  [ServerEvents.SensibilisationQuestion] : {
    question: SensibilisationQuestion;
  };

  [ServerEvents.SensibilisationAnswered]: {
    playersAnsweredCorrectly: {
      pseudo: string;
      clientInGameId: string;
    }[];
  };
  
  [ServerEvents.PlayerPassed]: {
    playerName: string; 
  };

  [ServerEvents.GameReport] : {
    winnerClientInGameId: string,
    winnerName: string,
    gameName: string,
    mostPopularCards : Card[],
    myArchivedCards : Card[],
  };

  [ServerEvents.AskDrawMode] : {
    sensibilisationPoints: number;
    formationCardLeft: boolean;
    formationSameTypeCardLeft: boolean;
    expertCardLeft: boolean;
  };

  [ServerEvents.GamePlayerDisconnection]: {
    clientInGameId: string;
    clientName: string;
  };
};


