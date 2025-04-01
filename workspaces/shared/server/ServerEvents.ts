export enum ServerEvents {
  // General
  Pong = 'server.pong',

  // Lobby
  LobbyJoined = 'server.lobby.joined',
  LobbyState = 'server.lobby.state',

  // Game
  GameStart = 'server.game.start',
  GameState = 'server.game.state',
  
  PlayerCardAction = 'server.game.player_card_action',
  AskDrawMode = "server.game.ask_draw_mode",

  SensibilisationQuestion = 'server.game.sensibilisation_question',
  SensibilisationAnswered = 'server.game.sensibilisation_answered',

  PracticeAnswered = 'server.game.practice_answered',

  PlayerPassed = 'server.game.player_passed',
  GameReport = 'server.game.game_report',
  

  GamePlayerDisconnection = 'server.game.player_disconnection',
}
