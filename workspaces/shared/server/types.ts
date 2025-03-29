import { SocketExceptions } from './SocketExceptions';

export type ServerExceptionResponse = {
  exception: SocketExceptions;
  message?: string | object;
};

export enum CardAction {
  DISCARD = 'discard',
  PLAY = 'play',
  DRAW = 'draw',
}