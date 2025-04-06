import { Lobby } from "@app/game/lobby/lobby";
import { ServerException } from "@app/game/server.exception";
import { AuthenticatedSocket } from "@app/game/types";
import { SocketExceptions } from "@shared/server/SocketExceptions";
import { Card, Best_Practice_Card, Bad_Practice_Card, Expert_Card, Formation_Card, Actor, CardType } from "@shared/common/Cards";
import { CO2Quantity } from "@app/game/lobby/types";
import { PlayerState } from "@app/game/instance/playerState";
import { CardService } from "@app/card/card.service";
import { BestPracticeAnswerType, BadPracticeAnswerType, PracticeAnswerType, SensibilisationQuestionAnswer, SensibilisationQuestion, GameState, DrawMode, pointCost, PlayerStateInterface } from "@shared/common/Game";
import { GameTurnState } from "./types";
import { SensibilisationService } from "@app/sensibilisation/sensibilisation.service";
import { GameService } from "../game.service";
import { UsersService } from "@app/users/users.service";
import { CardAction } from "@shared/server/types";

const NUMBER_CARDS_PER_PLAYER = 7;
const MAX_SENSIBILISATION_POINTS = 5;
export class Instance {
  public co2Quantity: CO2Quantity;
  public playerStates: Record<string, PlayerState> = {}; // keys: clientInGameId
  public cardDeck: Card[] = [];
  public discardPile: Card[] = [];

  public currentPlayerId: string = null;
  private startingPlayerId: string;
  private playOrder: string[] = []; // i = 0 -> id of starting player, i = 1 -> id of next player, etc.

  public gameStarted: boolean = false;
  public winningPlayerId: string | null = null;

  private currentSensibilisationQuestion: SensibilisationQuestion | null = null;
  private questionClientsResults: { clientInGameId: string; isCorrect: boolean; }[] = [];
  private countPracticeAnswer: number = 0;

  private currentTurnState: GameTurnState; // this is for animation synchronization for all players
  private stateFinished : number; //number of players finish this state (including action and animation)
  private selectedDrawMode : DrawMode = null;

  public cardService: CardService;
  public sensibilisationService: SensibilisationService;
  public gameService: GameService;
  public gameId: number;
  public userService: UsersService;

  constructor(
    private readonly lobby: Lobby,
    cardService: CardService,
    sensibilisationService: SensibilisationService,
    gameService: GameService,
  ) {
    this.cardService = cardService;
    this.sensibilisationService = sensibilisationService;
    this.gameService = gameService;
  }

  // ==========================================================================
  // ====PUBLIC METHODS: HANDLER OF ALL EVENTS IN GAME ========================
  // ==========================================================================

  public async triggerStart() {
    this.gameStarted = true;
    this.lobby.clients.forEach(client => {
      this.playerStates[client.gameData.clientInGameId] = new PlayerState(client.gameData.playerName, client.gameData.clientInGameId);
    });

    // Get the deck of cards and give cards to players
    this.cardDeck = await this.cardService.getDeck();
    this.initDrawCard();

    //the first player is chosen randomly
    const r = Math.floor(Math.random() * this.lobby.clients.size);
    this.startingPlayerId = Object.values(this.playerStates)[r].clientInGameId;
    this.createPlayerOrder(this.startingPlayerId);

    // Create the game in the database
    const game = await this.gameService.createGame();
    this.gameId = game.game_id;
    this.lobby.clients.forEach(async client => {
      await this.gameService.CreateUserGame(this.gameId, Number(client.gameData.clientInGameId));
    });

    this.currentSensibilisationQuestion = await this.sensibilisationService.getSensibilisationQuizz();
    this.lobby.dispatchSensibilisationQuestion(this.currentSensibilisationQuestion);
    this.lobby.dispatchGameStart();
  }

  public async removeClient(clientInGameId: string) {
    // Check if the client exists in playerStates
    if (!this.playerStates[clientInGameId]) {
      console.warn(`Client ${clientInGameId} not found in playerStates`);
      return;
    }

    // If the disconnected client is the current player
    if (this.currentPlayerId === clientInGameId) {
      // Transition to the next player
      this.currentPlayerId = Object.keys(this.playerStates)[(Object.keys(this.playerStates).indexOf(this.currentPlayerId) + 1) % Object.keys(this.playerStates).length];
    }

    // Remove the client from playerStates
    delete this.playerStates[clientInGameId];

    // Adjust the starting player if needed
    const remainingPlayers = Object.keys(this.playerStates);
    if (remainingPlayers.length < 2) { return; }
    if (this.startingPlayerId === clientInGameId) {
      this.startingPlayerId = remainingPlayers[0];
    }

    // Dispatch game state to inform other players
    this.lobby.dispatchGameState();
  }
  
  public async triggerFinish() {
    const winnerId = this.winningPlayerId;
    const winnerName = this.playerStates[winnerId].playerName;

    // Generate game report and personal game report
    this.cardDeck = await this.cardService.getDeck();
    await this.gameService.endGame(this.gameId, Number(winnerId))
    const mostPopularCards: Card[] = this.generateGeneralGameReport();

    // Dispatch game report to every player
    Object.keys(this.playerStates).forEach(playerId => {
      const myArchivedCards = this.generatePersonalGameReport(playerId);
      this.lobby.emitGameReport(playerId, { myArchivedCards, mostPopularCards }, winnerId, winnerName);
    });
  }

  public async answerSensibilisationQuestion(playerId: string, answer: SensibilisationQuestionAnswer) {
    const playerState = this.playerStates[playerId];
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, "Player not found");
    }

    // update canPlay and sensibilisationPoints if the answer is correct
    const isAnswerCorrect = answer.answer !== null && answer.answer === this.currentSensibilisationQuestion.answers.answer;
    if (isAnswerCorrect) {
      playerState.canPlay = true;
      playerState.sensibilisationPoints++;
      if (playerState.sensibilisationPoints > MAX_SENSIBILISATION_POINTS) {
        playerState.sensibilisationPoints = MAX_SENSIBILISATION_POINTS;
      }
    } else {
      playerState.canPlay = false;
    }
    
    this.questionClientsResults.push({ clientInGameId: playerId, isCorrect: isAnswerCorrect });
    if (this.questionClientsResults.length === this.lobby.clients.size) { // If every one answer the question:

      // Dispatch to every player
      const playersAnsweredCorrectly = this.questionClientsResults
        .filter(result => result.isCorrect)
        .map(result => ({ clientInGameId: result.clientInGameId, pseudo: this.playerStates[result.clientInGameId].playerName }));
      this.lobby.dispatchSensibilisationAnswered(playersAnsweredCorrectly);

      this.currentSensibilisationQuestion = null;
      this.questionClientsResults = [];

      // find the next player and accept the turn
      this.transitionToNextTurn();
    }
  }

  public async discardCard(card: Card, client: AuthenticatedSocket) {
    const playerState = this.playerStates[client.gameData.clientInGameId];
    if (!this.isThisPlayerTurn(playerState)) {
      throw new ServerException(SocketExceptions.GameError, "This is not player's turn");
    }

    this.moveToState(GameTurnState.DISCARD_PHASE, true);

    // Update the database
    playerState.cardsInHand = playerState.cardsInHand.filter(c => c.id !== card.id);
    await this.gameService.addToDiscardStack(this.gameId, Number(card.id));
    this.discardPile.push(card);

    const isPlayerBlocked: boolean = this.playerStates[this.currentPlayerId].badPractice == null ? false : true;
    if (isPlayerBlocked) {
      this.askDrawModeChoice();
      return;
    } else {
      this.selectedDrawMode = DrawMode.Random;
      this.lobby.dispatchPlayerCardAction(card, playerState.clientInGameId, this.playerStates, CardAction.DISCARD); 
    }
  }

  public async ReceptDrawModeChoice(drawMode: DrawMode) {
    this.selectedDrawMode = drawMode;
    const cardDiscarded = this.discardPile[this.discardPile.length - 1];
    this.lobby.dispatchPlayerCardAction(cardDiscarded, this.currentPlayerId, this.playerStates, CardAction.DISCARD); // Annouce all players that the card is discarded
  }

  public async playCard(card: Card, targetPlayerId:string | null, client: AuthenticatedSocket) {
    //retrieve the player state
    const playerState = this.playerStates[client.gameData.clientInGameId];
    if (!this.isThisPlayerTurn(playerState)) {
      throw new ServerException(SocketExceptions.GameError, "This is not player's turn");
    }
    this.verifyCardPlayed(card, playerState);

    this.moveToState(GameTurnState.PLAY_PHASE, true);
    
    await this.gameService.updateCardStackUserGameRelation(Number(card.id), Number(playerState.clientInGameId));
    //await this.gameService.updateBookletPracticeToApply(Number(playerState.clientInGameId), Number(card.id));

    //update card history and card in hand of player
    playerState.cardsHistory.push(card);
    playerState.cardsInHand = playerState.cardsInHand.filter(c => c.id !== card.id);

    // update game state base on the card type
    switch (card.cardType) {
      case "BestPractice":
        await this.playBestPractice(card, playerState);
        break;

      case "Expert":
        await this.playExpert(card, playerState);
        break;

      case "BadPractice":
        if (!targetPlayerId) throw new ServerException(SocketExceptions.GameError, "No target specified");
        await this.playBadPractice(card, targetPlayerId, playerState);
        break;

      case "Formation":
        await this.playFormation(card, playerState);
        break;
      default:
        throw new ServerException(SocketExceptions.GameError, "Invalid card type");
    }

    this.lobby.dispatchPlayerCardAction(card, playerState.clientInGameId, this.playerStates, CardAction.PLAY);
  }

  public async answerPracticeQuestion(playerId: string, cardId: string, cardType: CardType, answer: PracticeAnswerType) {
    const playerState = this.playerStates[playerId];
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, "Player not found");
    }

    switch (cardType) {
      case 'BestPractice':
        await this.answerBestPracticeQuestion(playerId, cardId, answer);
        break;
      case 'BadPractice':
        await this.answerBadPracticeQuestion(playerId, cardId, answer);
        break;
      default:
        throw new ServerException(SocketExceptions.GameError, 'Answer question invalid card type');
    }

    this.countPracticeAnswer++;
    if (this.countPracticeAnswer === this.lobby.clients.size) {
      this.countPracticeAnswer = 0;
      this.lobby.dispatchPracticeAnswered();
    }
    this.moveToNextState();
  }

  public moveToNextState() {
    this.stateFinished++;
    if (this.stateFinished === this.lobby.clients.size) {
      const currentPlayerState = this.playerStates[this.currentPlayerId];
      switch (this.currentTurnState) {
        case GameTurnState.DISCARD_PHASE:
          this.drawCard(currentPlayerState);
          break;
        case GameTurnState.PLAY_PHASE:
          if (!this.winningPlayerId ) {
            this.drawCard(currentPlayerState);
            break;
          }
          this.triggerFinish();
          break;
        case GameTurnState.DRAW_PHASE:
          this.transitionToNextTurn();
          break;
        default:
          return;
      }
    }
  }

  // ==========================================================================
  // ========================= PRIVATE METHODS ================================
  // ==========================================================================


  // =============== Draw card methods  ==========================
  private drawCard(playerState: PlayerState, initDraw = false) {
    if (!initDraw) { this.moveToState(GameTurnState.DRAW_PHASE) };

    // TODO: handle no card left to draw | and drawnCard = null;
    if (this.cardDeck.length === 0) return;
  
    const drawStrategies : Record<DrawMode, () => Card> =  {
      "random": () => this.cardDeck.pop(),
      "randomFormation": () => this.drawSpecificCardType("Formation"),
      "goodFormation": () => this.drawSpecificCardType("Formation", playerState.badPractice),
      "expert": () => this.drawSpecificCardType("Expert")
    };    
  
    let drawnCard : Card | null;
    try {
      drawnCard = drawStrategies[ this.selectedDrawMode ]();
    } catch (error) {
      drawnCard = this.cardDeck.pop();
      throw new ServerException(SocketExceptions.GameError, error.message);
    }

    playerState.cardsInHand.push(drawnCard);
    playerState.sensibilisationPoints -= pointCost[ this.selectedDrawMode ];
    if (!initDraw) { this.lobby.dispatchPlayerCardAction(drawnCard, playerState.clientInGameId, this.playerStates, CardAction.DRAW) };
  }
  
  private drawSpecificCardType(cardType: CardType, actor?: Actor): Card | null {
    const filteredCards = actor 
      ? this.cardDeck.filter(card => card.cardType === cardType && card.actor === actor)
      : this.cardDeck.filter(card => card.cardType === cardType);
  
    if (filteredCards.length === 0) return null;
  
    const card = filteredCards[0] 
    this.cardDeck.splice(this.cardDeck.indexOf(card), 1);
    return card;
  }

  private initDrawCard() {
    this.selectedDrawMode = DrawMode.Random;
    for (let i = 0; i < NUMBER_CARDS_PER_PLAYER; i++) {
      this.lobby.clients.forEach(client => {
        this.drawCard(this.playerStates[client.gameData.clientInGameId], true);
      });
    }
  }


  // =========== Turn of player methods =========================
  private getNextPlayer(): string | null {
    const totalPlayers = this.playOrder.length;
  
    let currentIndex = this.currentPlayerId !== null
      ? this.playOrder.indexOf(this.currentPlayerId) + 1
      : 0 ;
  
    while (currentIndex < totalPlayers) {
      if (this.playerStates[this.playOrder[currentIndex]].canPlay) {
        return this.playOrder[currentIndex];
      }
      currentIndex++;
    }
  
    return null;
  }

  private async transitionToNextTurn() {
    this.moveToState(GameTurnState.TURN_START, true);

    // 1: Change the current player
    this.currentPlayerId = this.getNextPlayer();
    console.log("[instane.ts] currentPlayerID: ", this.currentPlayerId);

    // 2: Dispatch Game State
    this.lobby.dispatchGameState();

    // 3: Ask 
    if (this.currentPlayerId === null) {
      this.currentSensibilisationQuestion = await this.sensibilisationService.getSensibilisationQuizz();
      this.lobby.dispatchSensibilisationQuestion(this.currentSensibilisationQuestion);
    }
  }

  private isThisPlayerTurn(playerState: PlayerState): boolean {
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, "Player not found");
    }

    if (this.currentPlayerId === playerState.clientInGameId && playerState.canPlay) {
      return true;
    }
    return false;
  }

  private createPlayerOrder(startingPlayerId: string) {
    const allPlayersId = Object.keys(this.playerStates);
    const totalPlayers = allPlayersId.length;

    let currentIndex = allPlayersId.indexOf(startingPlayerId);
    while (this.playOrder.length < totalPlayers) {
      this.playOrder.push( allPlayersId[currentIndex] );
      currentIndex = (currentIndex + 1) % totalPlayers;
    }
  }

  // ================= card action ===================
  private askDrawModeChoice() {
    const hasFormationCardInDeck = this.cardDeck.some(card => card.cardType === "Formation");
    const hasExpertCardInDeck = this.cardDeck.some(card => card.cardType === "Expert");

    const blockCardType = this.playerStates[this.currentPlayerId].badPractice;
    const hasFormationSameTypeInDeck = this.cardDeck.some(card => card.cardType === "Formation" && card.actor === blockCardType);
    this.lobby.emitAskDrawMode(this.playerStates[this.currentPlayerId].sensibilisationPoints, this.currentPlayerId, hasFormationCardInDeck, hasFormationSameTypeInDeck, hasExpertCardInDeck);
  }

  private verifyCardPlayed(card: Card, playerState: PlayerState) {
    if ( !playerState.badPractice ) { return; }
    if ( card.cardType === "Expert" ) { return; }
    if ( card.cardType === "Formation" && card.actor === playerState.badPractice) { return; }

    throw new ServerException(SocketExceptions.GameError, 
      "Player must play a fitting formation or expert card"
    );
  }

  private async playBestPractice(card: Best_Practice_Card, playerState: PlayerState) {
    playerState.co2Saved += card.carbon_loss;
    await this.gameService.updateUserCarbon(this.gameId, Number(playerState.clientInGameId), card.carbon_loss);

    if (playerState.co2Saved >= this.co2Quantity) {
      this.winningPlayerId = playerState.clientInGameId; // TODO: move this to another function
    }
  }

  private async playExpert(card: Expert_Card, playerState: PlayerState) {
    const actor = card.actor;
    playerState.expertCards.push(actor);

    // remove the bad practice card if the player has it
    if (playerState.badPractice == actor) {
      playerState.badPractice = null; // TODO: this should dispatch an event to make animation
    }
  }

  private async playBadPractice(card: Bad_Practice_Card, targetInGameId: string, playerState: PlayerState) {
    if (!targetInGameId) {
      throw new ServerException(SocketExceptions.GameError, "No target specified");
    }

    // Check if can apply bad practice to target
    const targetPlayerState = this.playerStates[targetInGameId];
    if (targetPlayerState.badPractice !== null) {
      throw new ServerException(SocketExceptions.GameError, "Player already targeted by a bad practice card");
    }

    if (targetPlayerState.expertCards.includes(card.actor)) {
      throw new ServerException(SocketExceptions.GameError, "Target player already has an expert card");
    }

    // update the database
    targetPlayerState.badPractice = card.actor;
    targetPlayerState.badPracticeCardApplied = card;
  }

  private async playFormation(card: Formation_Card, playerState: PlayerState) {
    const actor = card.actor;
    // remove the bad practice card if the player has it
    if (playerState.badPractice == actor) {
      playerState.badPractice = null;
    }
  }

  // ================= Report methods ==========================
  private generatePersonalGameReport(clientInGameId: string): Card[] {
    const myArchivedCards: Card[] = [];
    const playerState = this.playerStates[clientInGameId];
    
    // Process best practice cards
    playerState.bestPracticeAnswers
      .filter(answer => answer.answer === BestPracticeAnswerType.APPLICABLE)
      .forEach(answer => {
        const card = this.findCardOrThrow(answer.cardId);
        myArchivedCards.push(card);
      });
    
    // Process bad practice cards
    playerState.badPracticeAnswers
      .filter(answer => answer.answer === BadPracticeAnswerType.TO_BE_BANNED)
      .forEach(answer => {
        const card = this.findCardOrThrow(answer.cardId);
        myArchivedCards.push(card);
      });
      
    return myArchivedCards;
  }

  private generateGeneralGameReport(): Card[] {
    const popularBestPracticeCards: Record<string, number> = {};
    const popularBadPracticeCards: Record<string, number> = {};
    
    // Count card occurrences across all players
    Object.values(this.playerStates).forEach(playerState => {
      // Count best practice cards
      playerState.bestPracticeAnswers
        .filter(answer => answer.answer === BestPracticeAnswerType.APPLICABLE)
        .forEach(answer => {
          const card = this.findCardOrThrow(answer.cardId);
          popularBestPracticeCards[card.id] = (popularBestPracticeCards[card.id] || 0) + 1;
        });
        
      // Count bad practice cards
      playerState.badPracticeAnswers
        .filter(answer => answer.answer === BadPracticeAnswerType.TO_BE_BANNED)
        .forEach(answer => {
          const card = this.findCardOrThrow(answer.cardId);
          popularBadPracticeCards[card.id] = (popularBadPracticeCards[card.id] || 0) + 1;
        });
    });
    
    // Get top 3 cards from each category
    const top3BestPracticeIds = this.getTopCardIds(popularBestPracticeCards, 3);
    const top3BadPracticeIds = this.getTopCardIds(popularBadPracticeCards, 3);
    
    // Combine top cards into final result
    return [...top3BestPracticeIds, ...top3BadPracticeIds].map(id => this.findCardOrThrow(id));
  }

  // ================= Turn State methods ==========================
  private moveToState(state: GameTurnState, force: boolean = false) {
    if (this.currentTurnState === state) { return; }

    if (!force && this.stateFinished !== this.lobby.clients.size) {
      throw new ServerException(SocketExceptions.GameError, "Not all players finished the state");
    }

    this.currentTurnState = state;
    this.stateFinished = 0;
  }

  // ================= Answer methods ==========================
  private async answerBestPracticeQuestion(playerId: string, cardId: string, answer: PracticeAnswerType): Promise<void> {
    const playerState = this.playerStates[playerId];
    // if (!this.isThisPlayerTurn(playerState)) {
    //   throw new ServerException(SocketExceptions.GameError, "This is not player's turn");
    // }

    if (!this.verifyPracticeAnswer("bestPractice", answer)) {
      throw new ServerException(SocketExceptions.GameError, "Invalid best practice answer type");
    }

    if (answer === BestPracticeAnswerType.APPLICABLE){
      await this.gameService.updateGreenITBookletPracticeApply(Number(cardId), Number(playerState.clientInGameId));
    }
    playerState.bestPracticeAnswers.push({ cardId, answer: answer as BestPracticeAnswerType });
  }

  private async answerBadPracticeQuestion(playerId: string, cardId: string, answer: PracticeAnswerType): Promise <void> {
    const playerState = this.playerStates[playerId];
    // if (!this.isThisPlayerTurn(playerState)) {
    //   throw new ServerException(SocketExceptions.GameError, "This is not player's turn");
    // }

    if (!this.verifyPracticeAnswer("badPractice", answer)) {
      throw new ServerException(SocketExceptions.GameError, "Invalid bad practice answer type");
    }

    if (answer === BadPracticeAnswerType.TO_BE_BANNED){
      await this.gameService.updateGreenITBookletPracticeBan(Number(cardId), Number(playerState.clientInGameId));
    }

    playerState.badPracticeAnswers.push({ cardId, answer: answer as BadPracticeAnswerType });
  }

  // ================= Helper methods ==========================
  private findCardOrThrow(cardId: string): Card {
    const card = this.cardDeck.find(card => card.id === cardId);
    if (!card) {
      throw new ServerException(SocketExceptions.GameError, "Card not found");
    }
    return card;
  }
  
  private getTopCardIds(cardCounts: Record<string, number>, limit: number): string[] {
    return Object.entries(cardCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
  }

  private verifyPracticeAnswer(questionKind : "bestPractice" | "badPractice", answerType: BestPracticeAnswerType | BadPracticeAnswerType) : boolean {
    if (questionKind === "bestPractice"
        && answerType !== BestPracticeAnswerType.APPLICABLE 
        && answerType !== BestPracticeAnswerType.ALREADY_APPLICABLE 
        && answerType !== BestPracticeAnswerType.NOT_APPLICABLE) {
      return false;
    }

    if (questionKind === "badPractice"
        && answerType !== BadPracticeAnswerType.TO_BE_BANNED 
        && answerType !== BadPracticeAnswerType.ALREADY_BANNED 
        && answerType !== BadPracticeAnswerType.TOO_COMPLEX) {
      return false;
    }

    return true;
  }
}
