import { SocketExceptions } from './SocketExceptions';

export type ServerExceptionResponse = {
  exception: SocketExceptions;
  message?: string | object;
};

export type DrawMode = 'random' | 'randomFormation' | 'goodFormation' | 'expert';