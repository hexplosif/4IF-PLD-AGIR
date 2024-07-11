import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card";

@Entity()
export class Card_Content{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Card, (card) => card.contents)
    @JoinColumn({ name: "card_id" })
    card: Card;
    
    @Column({nullable: false})
    card_id : number;

    @Column({nullable: false})
    language: string;

    @Column({nullable: false})
    label: string;
    
    @Column({nullable: false})
    description: string;
}