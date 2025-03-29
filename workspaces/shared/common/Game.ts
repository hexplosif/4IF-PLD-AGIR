import { Card, Actor } from "./Cards";
import { Game_Status } from "@smart/api/src/entity/game";

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

export interface PlayerGameHistoryInterface {
  id: number;
  created_at: Date;
  updated_at: Date;
  finished_at: Date | null;
  round: number;
  status: Game_Status;
  carbon_loss: number;
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
  currentPlayerId: string | null;
  playerStates: PlayerStateInterface[];
  discardPile: Card[];
};

export interface SensibilisationQuestion {
  question_id : number,
  question: string;
  answers: {
    responses : string[],
    answer : number
  }
};

export interface SensibilisationQuestionAnswer {
  answer : number | null,
};

export enum DrawMode {
  Random = 'random',
  RandomFormation = 'randomFormation',
  GoodFormation = 'goodFormation',
  Expert = 'expert',
}

export const pointCost : Record<DrawMode, number> = {
  random: 1,
  randomFormation: 2,
  goodFormation: 3,
  expert: 5,
}



