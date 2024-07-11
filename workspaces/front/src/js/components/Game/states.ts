import { atom } from 'recoil';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';

export const CurrentLobbyState = atom<ServerPayloads[ServerEvents.LobbyState] | null>({
  key: 'CurrentLobbyState',
  default: null,
});

export const CurrentGameState = atom<ServerPayloads[ServerEvents.GameState] | null>({
  key: 'CurrentGameState',
  default: null,
});

export const CurrentSensibilisationQuestion = atom<ServerPayloads[ServerEvents.SensibilisationQuestion] | null>({
  key: 'CurrentSensibilisationQuestion',
  default: null,
});

export const CurrentPracticeQuestion = atom<ServerPayloads[ServerEvents.CardPlayed] | null>({
  key: 'CurrentPracticeQuestion',
  default: null,
});

export const CurrentGameReport = atom<ServerPayloads[ServerEvents.GameReport] | null>({
  key: 'CurrentGameReport',
  default: null,
});

export const CurrentPlayCard = atom<ServerPayloads[ServerEvents.CardPlayed] | null>({
  key: 'CurrentPlayCard',
  default: null,
});

export const CurrentUseSensibilisationPoints = atom<ServerPayloads[ServerEvents.UseSensibilisationPoints] | null>({
  key: 'CurrentUseSensibilisationPoints',
  default: null,
});
