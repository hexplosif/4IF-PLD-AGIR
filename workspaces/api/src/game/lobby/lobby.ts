import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from '@shared/server/ServerEvents';
import { AuthenticatedSocket } from '@app/game/types';
import { Instance } from '@app/game/instance/instance';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { Card } from '@shared/common/Cards';
import { SensibilisationQuestion } from '@shared/common/Game';
import { CardService } from '@app/card/card.service';
import { SensibilisationService } from '@app/sensibilisation/sensibilisation.service';
import { ServerException } from '../server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { GameService } from '../game.service';
import { CardAction } from '@shared/server/types';
import { PlayerState } from '../instance/playerState';

export class Lobby {
	// base class for lobby, which is responsible for emitting information to players

	public readonly id: string = v4();

	public readonly createdAt: Date = new Date();

	public readonly connectionCode: string = (Math.random() * 100000000 + '').substring(0, 6);

	public readonly maxClients: number = 4;

	public lobbyOwnerId: string;

	public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();

	// Keep in memory the clients that disconnected Map<clientInGameId, playerName>
	public readonly disconnectedClients: Map<string, string> = new Map<string, string>();

	public instance : Instance;
	
	constructor(
		private readonly server: Server,
		private readonly cardService: CardService,
		private readonly sensibilisationService : SensibilisationService,
		private readonly gameService: GameService,
		//private readonly userService: UsersService,
		co2Quantity: number,
		ownerId: string,
	) {
		this.lobbyOwnerId = ownerId;
		this.instance = new Instance(this, this.cardService, this.sensibilisationService, this.gameService);
		this.instance.co2Quantity = co2Quantity;
	}

	public addClient(client: AuthenticatedSocket, playerName: string, clientInGameId: string | null = null, isOwner: boolean = false): void {
		this.clients.set(client.id, client);
		client.join(this.id);
		console.log('[lobby] addClient', client.id, 'playerName', playerName, 'clientInGameId', clientInGameId, 'isOwner', isOwner);
		
		if (isOwner && !clientInGameId) {
			clientInGameId = this.lobbyOwnerId;
			console.log('[lobby] Owner joined lobby', this.id, 'as', clientInGameId);
		}
		
		client.gameData = {
			playerName,
			lobby: this,
			clientInGameId,
		} 
		
		this.emitToClient(client, ServerEvents.LobbyJoined, { clientInGameId });
		console.log(`[Lobby] Client ${client.id} joined lobby ${this.id} as ${clientInGameId}`);
		if (this.instance.gameStarted) {
			this.dispatchGameState();
		} else {
			this.dispatchLobbyState();
		}
	} 
 

	public removeClient(client: AuthenticatedSocket): void {
		this.disconnectedClients.set(client.gameData.clientInGameId, client.gameData.playerName);
		this.clients.delete(client.id);
		client.leave(this.id);
		client.gameData.lobby = null;

		this.dispatchLobbyState();
	}

	public reconnectClient(client: AuthenticatedSocket, clientInGameId: string): void {
		console.log(`[Lobby] Client`, client.id, 'reconnected as', clientInGameId);
		const playerName = this.disconnectedClients.get(clientInGameId);
		const isOwner = clientInGameId === this.lobbyOwnerId;
		this.addClient(client, playerName, clientInGameId, isOwner);
		this.disconnectedClients.delete(clientInGameId);
	}


	// ======================================================================
	// Dispatch: Emit to all players in game
	// ======================================================================

	broadcast(message: string): void {
		console.log('[lobby] broadcasting');
		this.clients.forEach((client: AuthenticatedSocket) => {
			client.emit('notification', { message });
		});
	}

	public dispatchDisconnectClient(client: AuthenticatedSocket): void {
		console.log(`[Disconnect] Client`, client.id, 'disconnected');

		const payload: ServerPayloads[ServerEvents.GamePlayerDisconnection] = {
			clientInGameId: client.gameData.clientInGameId,
			clientName: client.gameData.playerName,
		};

		this.dispatchToLobby(ServerEvents.GamePlayerDisconnection, payload);
	}

	public dispatchLobbyState(): void {
		const clientsNames: Record<string, string> = {};
		this.clients.forEach((client) => {
			clientsNames[client.gameData.clientInGameId] = client.gameData.playerName;
		});

		this.dispatchToLobby(ServerEvents.LobbyState, {
			lobbyId: this.id,
			connectionCode: this.connectionCode,
			co2Quantity: this.instance.co2Quantity,
			ownerId: this.lobbyOwnerId,
			clientsNames,
		});
	}

	public dispatchGameState(): void { //TODO: should not send playersState directly, where contains "cardsInHand" of all players, so user than see it in devtools
		this.dispatchToLobby(ServerEvents.GameState, {
			currentPlayerId: this.instance.currentPlayerId,
			playerStates: Object.values(this.instance.playerStates),
			discardPile: this.instance.discardPile,
		});
	}

	public dispatchGameStart(): void {
		this.dispatchToLobby(ServerEvents.GameStart, {
			gameState: {
				currentPlayerId: null,
				playerStates: Object.values(this.instance.playerStates),
				discardPile: this.instance.discardPile,
			}
		});
	}

	public dispatchSensibilisationQuestion(question: SensibilisationQuestion): void {
		this.dispatchToLobby(ServerEvents.SensibilisationQuestion, {question: question});
	}

	public dispatchSensibilisationAnswered(playersAnsweredCorrectly: {clientInGameId: string, pseudo: string}[]): void {
		this.dispatchToLobby(ServerEvents.SensibilisationAnswered, {playersAnsweredCorrectly});
	}

	public dispatchPlayerCardAction(card: Card, playerId: string, playerName: string, action: CardAction): void {
		if (action === CardAction.PLAY) {
			throw new ServerException(SocketExceptions.GameError, 'Use dispatch play card instead');
		}
		this.dispatchToLobby(ServerEvents.PlayerCardAction, { 
			playerId, playerName,
			card, action,
		});
	}

	public dispatchPlayCard(card: Card, playerState: PlayerState) {
		this.dispatchToLobby(ServerEvents.PlayCard, {
			card, playerState,
		});
	}

	public dispatchPracticeAnswered() {
		this.dispatchToLobby(ServerEvents.PracticeAnswered, {});
	}

	// ======================================================================
	// Emit: Emit to specific client
	// ======================================================================

	public emitGameReport(clientInGameId: string, gameReport: { myArchivedCards: Card[], mostPopularCards: Card[] } , winnerClientInGameId: string, winnerName: string): void {
		this.emitToClientInGame(clientInGameId, ServerEvents.GameReport, {
			mostPopularCards : gameReport.mostPopularCards,
			myArchivedCards : gameReport.myArchivedCards,
			winnerName,
			winnerClientInGameId,
		});
	}

	public emitAskDrawMode( sensibilisationPoints: number, clientInGameId: string, formationCardLeft: boolean, formationSameTypeCardLeft: boolean, expertCardLeft: boolean ): void {
		this.emitToClientInGame(clientInGameId, ServerEvents.AskDrawMode, {
			sensibilisationPoints,
			formationCardLeft,
			formationSameTypeCardLeft,
			expertCardLeft,
		});
	}

	// ======================================================================
	// Helper methods
	// ======================================================================
	
	public emitToClientInGame<T extends ServerEvents>(clientInGameId: string, event: T, payload: ServerPayloads[T]): void {
		let emittedClient = this.clients.get(clientInGameId);
		this.clients.forEach((client) => {
			if(client.gameData.clientInGameId === clientInGameId){
				emittedClient = client;
			}
		});
		if (emittedClient === null) { 
			throw new ServerException(SocketExceptions.ClientNotFound, 'Client with id ' + clientInGameId + ' not found!');
		}
		this.emitToClient(emittedClient, event, payload);
	}

	public dispatchToLobby<T extends ServerEvents>(event: T, payload: ServerPayloads[T]): void {
		this.server.to(this.id).emit(event, payload);
	}

	public emitToClient<T extends ServerEvents>(client: AuthenticatedSocket, event: T, payload: ServerPayloads[T]): void {
		client.emit(event, payload);
	}
}
