export enum ServerEvents {
  // General
  Pong = 'server.pong',

  // Lobby
  LobbyJoined = 'server.lobby.joined',
  LobbyState = 'server.lobby.state',

  // Game
  GameStart = 'server.game.start',
  GameState = 'server.game.state',
  PracticeAnswered = 'server.game.practice_answered',
  CardPlayed = 'server.game.card_played',
  SensibilisationQuestion = 'server.game.sensibilisation_question',
  SensibilisationAnswered = 'server.game.sensibilisation_answered',
  PlayerPassed = 'server.game.player_passed',
  GameReport = 'server.game.game_report',
  UseSensibilisationPoints = "server.game.use_sensibilisation_points",
}
