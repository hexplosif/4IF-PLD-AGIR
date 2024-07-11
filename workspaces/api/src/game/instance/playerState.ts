import { Actor, Card } from "@shared/common/Cards";
import { PlayerStateInterface, BestPracticeAnswer, BadPracticeAnswer } from "@shared/common/Game";

export class PlayerState implements PlayerStateInterface {

  public badPractice: Actor | null = null;
  public canPlay: boolean = false;
  public cardsHistory: Card[] = [];
  public cardsInHand: Card[] = [];
  public co2Saved: number = 1000;
  public expertCards: Actor[] = [];
  public sensibilisationPoints: number = 0;
  public bestPracticeAnswers: BestPracticeAnswer[] = [];
  public badPracticeAnswers: BadPracticeAnswer[] = [];
  public clientInGameId: string;
  public playerName:string;
  //public clientId: number;

  constructor(playerName:string, playerId:string, co2Quantity:number){
    this.playerName = playerName;
    this.clientInGameId = playerId;
    this.co2Saved = co2Quantity;
    //this.clientId = clientId;
  }

}
