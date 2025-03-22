import { Column, Entity, JoinTable, Long, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card";
import { Actor as ActorType } from "@shared/common/Cards";
import { Language } from "@shared/common/Languages";

@Entity()
export class Actor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: false})
    type : ActorType;

    @Column({nullable : false})
    language: Language;

    @ManyToMany(() => Card, card => card.actors)
    @JoinTable()
    cards: Card[];

}