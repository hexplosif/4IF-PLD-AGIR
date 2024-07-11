import { Column, Entity, JoinTable, Long, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card";

@Entity()
export class Actor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable : false})
    language: string;

    @ManyToMany(() => Card, card => card.actors)
    @JoinTable()
    cards: Card[];

}