import { atom } from 'recoil';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Card } from '@shared/common/Cards';

export const LobbyState = atom<ServerPayloads[ServerEvents.LobbyState] | null>({
  key: 'CurrentLobbyState',
  default: null,
});

export const GameState = atom<ServerPayloads[ServerEvents.GameState] | null>({
  key: 'CurrentGameState',
  default: null,
});

export const SensibilisationQuestionState = atom<ServerPayloads[ServerEvents.SensibilisationQuestion] | null>({
  key: 'CurrentSensibilisationQuestion',
  default: null,
});

export const GameReportState = atom<ServerPayloads[ServerEvents.GameReport] | null>({
  key: 'CurrentGameReport',
  default: null,
});

export const PlayCardState = atom<ServerPayloads[ServerEvents.PlayerCardAction] | null>({
  key: 'CurrentPlayCard',
  default: null,
});

export const AskDrawModeState = atom<ServerPayloads[ServerEvents.AskDrawMode] | null>({
  key: 'AskDrawMode',
  default: null,
});


type PracticeQuestionState = {
  card: Card;
}

export const PracticeQuestionState = atom<PracticeQuestionState | null>({
  key: 'CurrentPracticeQuestion',
  default: null,
});