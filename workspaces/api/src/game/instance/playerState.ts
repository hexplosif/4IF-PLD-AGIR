import { Actor, Card } from "@shared/common/Cards";
import { PlayerStateInterface, BestPracticeAnswer, BadPracticeAnswer } from "@shared/common/Game";

export class PlayerState implements PlayerStateInterface {

  public expertCards: Actor[] = [];
  public badPractice: Actor | null = null; 
  public badPracticeCardApplied: Card | null = null;
  public cardsHistory: Card[] = [];

  public canPlay: boolean = false;
  public cardsInHand: Card[] = [];
  public co2Saved: number = 0;
  
  public sensibilisationPoints: number = 0;
  public bestPracticeAnswers: BestPracticeAnswer[] = [];
  public badPracticeAnswers: BadPracticeAnswer[] = [];

  public clientInGameId: string;
  public playerName:string;

  public gameLanguage: string;

  constructor(playerName: string, clientInGameId: string){
    this.playerName = playerName;
    this.clientInGameId = clientInGameId;
    this.gameLanguage = 'fr';
  }

}
