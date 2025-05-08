import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ClientPayloads } from '@shared/client/ClientPayloads';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { Logger, UsePipes } from '@nestjs/common';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { ClientReconnectDto, ClientStartGameDto, LobbyCreateDto, LobbyJoinDto, SensibilisationAnswerDto } from '@app/game/dtos';
import { WsValidationPipe } from '@app/websocket/ws.validation-pipe';



@UsePipes(new WsValidationPipe())
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(private readonly lobbyManager: LobbyManager) { }

  afterInit(server: any) {
    this.lobbyManager.server = server;
  }

  // =================================================================
  // Connections
  // =================================================================

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    this.logger.log('Client connected', client.id);
    this.logger.log('Client connected', client);
    const authenticatedClient: AuthenticatedSocket = client as AuthenticatedSocket;
    authenticatedClient.gameData = {
      lobby: null,
      playerName: null,
      clientInGameId: null,
    }

    this.lobbyManager.initializeSocket(authenticatedClient);
  }

  async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
    this.lobbyManager.disconnectClient(client); // dispatch the disconnections
  }

  @SubscribeMessage(ClientEvents.ClientReconnect)
  onClientReconnect(client: AuthenticatedSocket, data: ClientReconnectDto): void {
    this.logger.log('Client reconnecting', data.clientInGameId);
    this.lobbyManager.reconnectClient(client, data.clientInGameId);
  }

  // =================================================================
  // Lobby
  // =================================================================

  @SubscribeMessage(ClientEvents.LobbyCreate)
  async onLobbyCreate(client: AuthenticatedSocket, data: LobbyCreateDto) {
    const lobby =  await this.lobbyManager.createLobby(data.co2Quantity, data.ownerToken,data.gameName);
    lobby.addClient(client, data.playerName, null, true);
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto) {
    this.lobbyManager.joinLobby(client, data.connectionCode, data.playerName, data.playerToken);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(client: AuthenticatedSocket): void {
    client.gameData.lobby?.removeClient(client);
  }

  @SubscribeMessage(ClientEvents.LobbyStartGame)
  onLobbyStartGame(client: AuthenticatedSocket, data: ClientStartGameDto): void {
    this.lobbyManager.startGame(client, data.clientInGameId);
  } 

  // =================================================================
  // Game
  // =================================================================

  @SubscribeMessage(ClientEvents.PlayCard)
  onPlayCard(client: AuthenticatedSocket, data: ClientPayloads[ClientEvents.PlayCard]): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.playCard(data.card, data.targetPlayerId, client);
  }

  @SubscribeMessage(ClientEvents.DiscardCard)
  onDiscardCard(client: AuthenticatedSocket, data: ClientPayloads[ClientEvents.DiscardCard]): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.discardCard(data.card, client);
  }

  @SubscribeMessage(ClientEvents.AnswerSensibilisationQuestion)
  onSensibilisationQuestion(client: AuthenticatedSocket, data: SensibilisationAnswerDto): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.answerSensibilisationQuestion(client.gameData.clientInGameId, data.answer);
  }

  @SubscribeMessage(ClientEvents.AnswerPracticeQuestion)
  async onPracticeQuestionAnswer(client: AuthenticatedSocket, data: ClientPayloads[ClientEvents.AnswerPracticeQuestion]) {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.answerPracticeQuestion(client.gameData.clientInGameId, data.cardId, data.cardType, data.answer,);
  }

  @SubscribeMessage(ClientEvents.DrawModeChoice)
  onDrawModeChoice(client: AuthenticatedSocket, data: ClientPayloads[ClientEvents.DrawModeChoice]): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.ReceptDrawModeChoice(data.drawMode);
  }

  @SubscribeMessage(ClientEvents.AcknowledgeAnimation)
  onAnimationFinished(client: AuthenticatedSocket): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.moveToNextState();
  }

  @SubscribeMessage(ClientEvents.EndGame)
  onEndGame(client: AuthenticatedSocket): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.triggerFinish();
  }
}
