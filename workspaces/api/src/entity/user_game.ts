import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Card } from "./card";
import { Actor } from "./actor";
import { Expert_Card } from "./expert_card";
import { Game } from "./game";

export enum Bad_Practices_Status {
    BANABLE = 'banable',
    ALREADY_BANNED = 'already_banned',
    HARD_TO_AVOID = 'hard_to_avoid'
}

export enum Best_Practices_Status {
    APPLICABLE = 'applicable',
    APPLIED = 'applied',
    NOT_APPLICABLE = 'not_applicable'
}
@Entity()
export class User_Game {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    user_id: number;

    user: User;

    @Column({nullable: false})
    game_id: number;

    @ManyToOne(() => Game, game => game.users)
    @JoinColumn({ name: "game_id" })
    game: Game;

    @Column({nullable: false})
    carbon_loss: number;

    @ManyToMany(() => Card, card => card.cards_stack_users_game)
    cards_stack: Card[];

    @ManyToOne(() => Actor)
    bad_practice: Actor;

    @ManyToMany(() => Actor)
    @JoinTable()
    expertize: Actor[];

    @Column('jsonb', { nullable: true })
    bad_practices_cards: Record<number, Bad_Practices_Status>; 

    @Column('jsonb', { nullable: true })
    best_practices_cards : Record<number, Best_Practices_Status>;
}