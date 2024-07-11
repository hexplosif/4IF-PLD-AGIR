import { GameState, SensibilisationQuestion } from '../common/Game';
import { ServerEvents } from './ServerEvents';
import { Card, CardType } from '../common/Cards';

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
    sensibilisationQuestion: SensibilisationQuestion;
  };

  [ServerEvents.GameState]: GameState;

  [ServerEvents.PracticeAnswered]: {};

  [ServerEvents.CardPlayed]: {
    playerId: string;
    playerName: string;
    card: Card;
    discarded: boolean;
  };
  
  [ServerEvents.SensibilisationQuestion] : {
    question_id : number,
    question: string;
    answers: {
      response1 : string,
      response2 : string,
      response3 : string,
      answer : number
    }
  };

  [ServerEvents.SensibilisationAnswered]: {};
  
  [ServerEvents.PlayerPassed]: {
    playerName: string; 
  };

  [ServerEvents.GameReport] : {
    winnerName: string,
    mostPopularCards : Card[],
    myArchivedCards : Card[],
  };

  [ServerEvents.UseSensibilisationPoints] : {
    sensibilisationPoints: number;
    isBlocked: boolean;
    formationCardLeft: boolean;
    expertCardLeft: boolean;
  };
};


