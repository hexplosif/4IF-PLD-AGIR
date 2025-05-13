import { Column } from "typeorm";
import { Difficulty } from "@shared/common/Cards";
import { Card } from "./card";
export class Practice_Card extends Card {

  @Column({ nullable: false })
  network_gain: boolean;

  @Column({ nullable: false })
  memory_gain: boolean;

  @Column({ nullable: false })
  cpu_gain: boolean;

  @Column({ nullable: false })
  storage_gain: boolean;

  @Column({ type: "enum", enum: Difficulty, default: Difficulty.ONE })
  difficulty: Difficulty;

  @Column({ nullable: false })
  interface_composant: boolean;

  @Column({ nullable: false })
  data_composant: boolean;

  @Column({ nullable: false })
  network_composant: boolean;
  
  @Column({ nullable: false })
  performance_composant: boolean;

  @Column({ nullable: false })
  system_composant: boolean;
}
