import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card";
import { Question } from "./question";
import { User_Game } from "./user_game";

export enum Game_Status {
  STARTED = "started",
  PAUSED = "paused",
  CANCELED = "canceled",
  FINISHED = "finished",
}
@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date", nullable: false })
  created_at: Date;

  @Column({ type: "date", nullable: false })
  updated_at: Date;

  @Column({ type: "date", nullable: true })
  finished_at: Date;

  @OneToMany(() => User_Game, user_game => user_game.game)
  users: User_Game[];

  @Column({ nullable: false })
  round: number;

  @Column({ nullable: false })
  user_turn: number;

  @Column({ type: "enum", enum: Game_Status, default: Game_Status.STARTED })
  status: Game_Status;

  @ManyToMany(() => Card, card => card.games)
  @JoinTable({ name: "discard_stack_cards_games" })
  discard_stack: Card[];

  @ManyToMany(() => Card, card => card.games)
  @JoinTable({ name: "deck_stack_cards_games" })
  deck_stack: Card[];

  @Column({ nullable: true })
  winner_id: number;

  @OneToOne(() => User_Game, user_game => user_game.id)
  winner: User_Game;

  @ManyToMany(() => Question, question => question.games)
  questions: Question[];
}
