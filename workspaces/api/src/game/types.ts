import { Socket } from 'socket.io';
import { Lobby } from '@app/game/lobby/lobby';
import { ServerEvents } from '@smart/shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';

export type AuthenticatedSocket = Socket & {
  gameData: {
    lobby: null | Lobby;
    clientInGameId: null | string;
    playerName: null | string;
  };

  emit: <T extends ServerEvents>(ev: T, data: ServerPayloads[T]) => boolean;
};
