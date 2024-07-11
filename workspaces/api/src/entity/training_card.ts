import { Column, Entity } from "typeorm";
import { Card } from "./card";

@Entity()
export class Training_Card extends Card{

    @Column()
    link: string;
}