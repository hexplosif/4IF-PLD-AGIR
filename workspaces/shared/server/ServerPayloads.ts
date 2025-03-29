import { GameState, SensibilisationQuestion } from '../common/Game';
import { ServerEvents } from './ServerEvents';
import { Card } from '../common/Cards';
import { CardAction } from './types';
import { PlayerState } from '@app/game/instance/playerState';

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
    // A Record from id to playerName
    clientsNames: Record<string, string>;
  };

  [ServerEvents.GameStart]: {
    gameState: GameState;
  };

  [ServerEvents.GameState]: GameState;

  [ServerEvents.PracticeAnswered]: {};

  [ServerEvents.PlayerCardAction]: {
    playerId: string;
    playerName: string;
    card: Card;
    action: CardAction;
  };

  [ServerEvents.PlayCard]: {
    playerState: PlayerState;
    card: Card;
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


