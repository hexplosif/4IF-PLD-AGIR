import { Lobby } from '@app/game/lobby/lobby';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { LOBBY_MAX_LIFETIME } from '@app/game/constants';
import { CO2Quantity } from '@app/game/lobby/types';
import { Cron } from '@nestjs/schedule'
import { CardService } from '@app/card/card.service';
import { Inject } from '@nestjs/common';
import { SensibilisationService } from '@app/sensibilisation/sensibilisation.service';
import { GameService } from '../game.service';
import { UsersService } from '@app/users/users.service';
import { AuthService } from '@app/authentification/authentification.service';

export class LobbyManager {
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

  @Inject(CardService)
  private readonly cardService: CardService;

  @Inject(SensibilisationService)
  private readonly sensibilisationService: SensibilisationService;
  public initializeSocket(client: AuthenticatedSocket): void {
    client.gameData.lobby = null;
  }

  @Inject(GameService)
  private readonly gameService: GameService;

  @Inject(AuthService)
  private readonly authService: AuthService;

  /* @Inject(UsersService)
  private readonly userService: UsersService; */

  public terminateSocket(client: AuthenticatedSocket): void {
    client.gameData.lobby?.removeClient(client);
  }

  public async createLobby(co2Quantity: CO2Quantity, ownerToken: string, gameName: string): Promise<Lobby> {
    const ownerId = await this.authService.getUserByToken(ownerToken);
    console.log('[lobby manager] createLobby, authService await ', ownerId)
    const lobby = new Lobby(this.server, this.cardService,this.sensibilisationService , this.gameService, co2Quantity, ownerId.toString(), gameName);
    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  public async joinLobby(client: AuthenticatedSocket, connectionCode: string, playerName: string, playerToken: string | null, language: string): Promise<void> {
    const lobby = Array.from(this.lobbies.values()).find((lobby) => lobby.connectionCode === connectionCode)
    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    const playerId = await this.authService.getUserByToken(playerToken);
    console.log('[lobby manager] joinLobby, authService await ', playerId);
    const playerInGameId = playerId.toString();
    console.log('[lobby manager] joinLobby, playerInGameId', playerInGameId);

    if (lobby.clients.size >= lobby.maxClients) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby already full');
    }

    lobby.addClient(client, playerName, playerInGameId, false, language);
  }

  public setClientLanguage(client: AuthenticatedSocket, language: string): void {
    const lobby = client.gameData.lobby;
    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }
    lobby.setClientLanguage(client, language);
  }

  public startGame(client: AuthenticatedSocket, playerInGameId: string): void {
    const lobby = client.gameData.lobby;
    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Not in lobby');
    }
    
    if (lobby.lobbyOwnerId !== playerInGameId) {
      console.log('[lobbymanager] client',lobby.lobbyOwnerId,  'is the lobby owner but playerInGameId', playerInGameId, 'is not the owner');
      throw new ServerException(SocketExceptions.LobbyError, 'Only lobby owner can start the game',);
    }

    lobby.instance.triggerStart();
  }

  public disconnectClient(client: AuthenticatedSocket): void {
    const lobby = client.gameData.lobby;
    if (!lobby) { return; }

    lobby.dispatchDisconnectClient(client);
    lobby.instance.removeClient(client.gameData.clientInGameId);
    this.terminateSocket(client);

    // Check if there is only one client, then he/she will be the winner
    if (lobby.clients.size === 1) {
      const lastClient = lobby.clients.values().next().value;
      lobby.instance.winningPlayerId = lastClient.gameData.clientInGameId;
      lobby.instance.triggerFinish();
      return;
    }
  }

  public reconnectClient(client: AuthenticatedSocket, clientInGameId: string): void {
    const lobby = Array.from(this.lobbies.values()).find((lobby) => lobby.disconnectedClients.has(clientInGameId));

    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Client not found');
    }

    lobby.reconnectClient(client, clientInGameId);

  }

  // Periodically clean up lobbies
  @Cron('*/5 * * * *')
  private lobbiesCleaner(): void {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = (new Date()).getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        //TODO: Notify clients that lobby is closing

        this.lobbies.delete(lobby.id);
      }
    }
  }
}
