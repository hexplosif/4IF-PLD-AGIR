import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ClientPayloads } from '@shared/client/ClientPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { Logger, UsePipes } from '@nestjs/common';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ClientReconnectDto, ClientStartGameDto, LobbyCreateDto, LobbyJoinDto, PracticeAnswerDto, SensibilisationAnswerDto } from '@app/game/dtos';
import { WsValidationPipe } from '@app/websocket/ws.validation-pipe';



@UsePipes(new WsValidationPipe())
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(private readonly lobbyManager: LobbyManager) { }

  afterInit(server: any) {
    this.lobbyManager.server = server;
  }

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
    this.lobbyManager.terminateSocket(client); // Handle termination of socket
  }

  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: AuthenticatedSocket): void {
    this.logger.log('Ping received ', client.id);
    client.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  @SubscribeMessage(ClientEvents.LobbyCreate)
  async onLobbyCreate(client: AuthenticatedSocket, data: LobbyCreateDto) {
      // Attempt to create a lobby and add a client to it
      const lobby =  await this.lobbyManager.createLobby(data.co2Quantity, data.ownerToken);
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

  @SubscribeMessage(ClientEvents.ClientReconnect)
  onClientReconnect(client: AuthenticatedSocket, data: ClientReconnectDto): void {
    this.logger.log('Client reconnecting', data.clientInGameId);
    this.lobbyManager.reconnectClient(client, data.clientInGameId);
  }


  @SubscribeMessage(ClientEvents.PlayCard)
  onPlayCard(client: AuthenticatedSocket, data: ClientPayloads[ClientEvents.PlayCard]): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.playCard(data.card, client);
  }

  @SubscribeMessage(ClientEvents.DiscardCard)
  onDiscardCard(client: AuthenticatedSocket, data: ClientPayloads[ClientEvents.DiscardCard]): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.discardCard(data.card, client);
  }

  @SubscribeMessage(ClientEvents.AnswerPracticeQuestion)
  onPracticeQuestion(client: AuthenticatedSocket, data: ClientPayloads[ClientEvents.AnswerPracticeQuestion]): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    const cardType = data.cardType;
    switch (cardType) {
      case 'BestPractice':
        client.gameData.lobby.instance.answerBestPracticeQuestion(client.gameData.clientInGameId, data.cardId, data.answer);
        break;
      case 'BadPractice':
        client.gameData.lobby.instance.answerBadPracticeQuestion(client.gameData.clientInGameId, data.cardId, data.answer);
        break;
      default:
        throw new ServerException(SocketExceptions.GameError, 'Answer question invalid card type');
    }
  }

  @SubscribeMessage(ClientEvents.AnswerSensibilisationQuestion)
  onSensibilisationQuestion(client: AuthenticatedSocket, data: SensibilisationAnswerDto): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    this.logger.log(`Client ${client.gameData.playerName} answered sensibilisation question with answer index: ${data.answer.answer}`);
    client.gameData.lobby.instance.answerSensibilisationQuestion(client.gameData.clientInGameId, data.answer);
  }

  @SubscribeMessage(ClientEvents.GetSensibilisationQuestion)
  onSensibilisationQuestionGet(client: AuthenticatedSocket): void {
    /*if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }*/
    // Retourner le contenu dans un objet littéral

  }

  @SubscribeMessage(ClientEvents.DrawModeChoice)
  onDrawModeChoice(client: AuthenticatedSocket, data: ClientPayloads[ClientEvents.DrawModeChoice]): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.ReceptDrawModeChoice(data.drawMode);
  }

}
