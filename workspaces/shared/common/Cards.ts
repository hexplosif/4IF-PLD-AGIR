import { Language } from "./Languages";

export interface BaseCard {
  id: string;
  actor: Actor;
  title: string;
  contents: string;
  cardType: CardType;
}

export type CardType = 'Expert' | 'BestPractice' | 'BadPractice' | 'Formation' | 'EmptyCard';

export type Card = Expert_Card | Best_Practice_Card | Bad_Practice_Card | Formation_Card | EmptyCard;

export interface Practice_Card extends BaseCard {
  network_gain?: boolean;
  memory_gain?: boolean;
  cpu_gain?: boolean;
  storage_gain?: boolean;
  difficulty?: Difficulty;
  targetedPlayerId?: string;
  carbon_loss?: number;
  interface_composant?: boolean;
  data_composant?: boolean;
  network_composant?: boolean;
  performance_composant?: boolean;
  system_composant?: boolean;
}

export interface Best_Practice_Card extends Practice_Card {
  cardType: 'BestPractice';
  
}

export interface Bad_Practice_Card extends Practice_Card {
  cardType: 'BadPractice';
}

export interface Formation_Card extends BaseCard {
  cardType: 'Formation';
  linkToFormation: string;
}

export interface Expert_Card extends BaseCard {
  cardType: 'Expert';
}

export interface EmptyCard extends BaseCard {
  cardType: 'EmptyCard'
}

export type MultipleContentsCard = (
  | TransformCard<Expert_Card>
  | TransformCard<Best_Practice_Card>
  | TransformCard<Bad_Practice_Card>
  | TransformCard<Formation_Card>
  | TransformCard<EmptyCard>
);

export type MultipleContentsExpertCard = TransformCard<Expert_Card>;
export type MultipleContentsBestPracticeCard = TransformCard<Best_Practice_Card>;
export type MultipleContentsBadPracticeCard = TransformCard<Bad_Practice_Card>;
export type MultipleContentsFormationCard = TransformCard<Formation_Card>;

type TransformCard<T extends BaseCard> = Omit<T, "actor" | "title" | "contents"> & {
  languageContents: {
    language: Language;
    actorName: string;
    actorType: Actor;
    title: string;
    description: string;
  }[];
};

export enum Actor {
  ARCHITECT = 'Architect',
  DEVELOPER = 'Developer',
  PRODUCT_OWNER = 'ProductOwner',
}

export enum Difficulty {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
}
