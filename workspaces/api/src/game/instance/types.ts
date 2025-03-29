export enum GameTurnState {
    TURN_START = 'turn_start', // player thinking his movement
    PLAY_PHASE = 'play_phase', // player playing his card
    DISCARD_PHASE = 'discard_phase', // player discarding his card
    DRAW_PHASE = 'draw_phase', // player drawing a card
}