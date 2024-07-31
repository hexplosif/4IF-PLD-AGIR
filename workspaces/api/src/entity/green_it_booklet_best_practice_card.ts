import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Best_Practice_Card } from './best_practice_card';
import { Green_IT_Booklet } from './green_it_booklet';

@Entity()
export class Green_IT_Booklet_Best_Practice_Card {
  @PrimaryColumn()
  greenItBookletId: number;

  @PrimaryColumn()
  bestPracticeCardId: number;

  @Column({ nullable: true })
  priority: number;

  @ManyToOne(() => Green_IT_Booklet, greenItBooklet => greenItBooklet.practices_to_apply)
  @JoinColumn({ name: "greenItBookletId" })
  greenItBooklet: Green_IT_Booklet;

  @ManyToOne(() => Best_Practice_Card, bestPracticeCard => bestPracticeCard.green_it_booklet_practices_to_apply)
  @JoinColumn({ name: "bestPracticeCardId" })
  bestPracticeCard: Best_Practice_Card;
}
