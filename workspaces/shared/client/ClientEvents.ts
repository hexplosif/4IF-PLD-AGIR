export enum ClientEvents {
  // General
  AcknowledgeAnimation = 'client.animation.acknowledge',

  // Lobby
  LobbyCreate = 'client.lobby.create',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  LobbyStartGame = 'client.lobby.start',

  // Game
  AnswerPracticeQuestion = 'client.game.answer_practice_question',
  AnswerSensibilisationQuestion = 'client.game.answer_sensibilisation_question',
  PlayCard = 'client.game.play_card',
  DiscardCard = 'client.game.discard_card',

  DrawModeChoice = 'client.game.draw_mode',

  playerDisconnected = 'client.disconnect',

  // Reconnecting
  ClientReconnect = 'client.reconnect'
}
