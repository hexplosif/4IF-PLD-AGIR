export enum SocketExceptions
{
  // General
  UnexpectedError = 'exception.unexpected_error',
  UnexpectedPayload = 'exception.unexpected_payload',

  // Lobby
  LobbyError = 'exception.lobby.error',

  // Game
  GameError = 'exception.game.error',
  ClientNotFound = 'exception.client_not_found',
  TargetBadPracticeError = 'exception.game.target_bad_practice_error',

  NoCardLeft = 'exception.game.no_card_left',
  NoCardTypeLeft = 'exception.game.no_card_type_left',
 
}
