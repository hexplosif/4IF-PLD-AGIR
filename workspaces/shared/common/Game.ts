import { Card, Actor } from "./Cards";

export interface PlayerStateInterface {
  clientInGameId: string;
  playerName: string;
  co2Saved: number;
  canPlay: boolean;
  sensibilisationPoints: number;
  badPractice: Actor | null;
  expertCards: Actor[];
  cardsHistory: Card[];
  cardsInHand: Card[];
  bestPracticeAnswers: BestPracticeAnswer[];
  badPracticeAnswers: BadPracticeAnswer[];
}

export interface BestPracticeAnswer {
  cardId: string;
  answer: BestPracticeAnswerType;
}

export interface BadPracticeAnswer {
  cardId: string;
  answer: BadPracticeAnswerType;
}

export type PracticeAnswer = BestPracticeAnswer | BadPracticeAnswer;

export type PracticeAnswerType = BestPracticeAnswerType | BadPracticeAnswerType;

export enum BestPracticeAnswerType {
  APPLICABLE = 'applicable',
  ALREADY_APPLICABLE = 'already_applicable',
  NOT_APPLICABLE = 'not_applicable',
}

export enum BadPracticeAnswerType {
  TO_BE_BANNED = 'to_be_banned',
  ALREADY_BANNED = 'already_banned',
  TOO_COMPLEX = 'too_complex',
}


export interface GameState {
  currentPlayerId: string;
  playerStates: PlayerStateInterface[];
  discardPile: Card[];
};

export interface SensibilisationQuestion {
  question_id : number,
  question: string;
  answers: {
    response1 : string,
    response2 : string,
    response3 : string,
    answer : number
  }
};

  export interface SensibilisationQuestionAnswer {
    answer : number
  };


