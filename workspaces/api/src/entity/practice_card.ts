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
}
