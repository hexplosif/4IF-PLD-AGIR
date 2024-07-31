import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Bad_Practice_Card } from './bad_practice_card';
import { Green_IT_Booklet } from './green_it_booklet';


@Entity()
export class Green_IT_Booklet_Bad_Practice_Card {
  @PrimaryColumn()
  greenItBookletId: number;

  @PrimaryColumn()
  badPracticeCardId: number;

  @Column({ nullable: true })
  priority: number;

  @ManyToOne(() => Green_IT_Booklet, greenItBooklet => greenItBooklet.practices_to_ban)
  @JoinColumn({ name: "greenItBookletId" })
  greenItBooklet: Green_IT_Booklet;

  @ManyToOne(() => Bad_Practice_Card, badPracticeCard => badPracticeCard.green_it_booklet_practices_to_ban)
  @JoinColumn({ name: "badPracticeCardId" })
  badPracticeCard: Bad_Practice_Card;
}
