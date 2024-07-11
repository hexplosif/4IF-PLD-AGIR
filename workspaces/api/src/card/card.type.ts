export interface CsvCard {
  id?: number;
  cardType?: string;
  language: string;
  label: string;
  description: string;
  link?: string;
  actorType?: string;
  networkGain?: number;
  memoryGain?: number;
  cpuGain?: number;
  storageGain?: number;
  difficulty?: number;
}
