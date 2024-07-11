import { Column, Entity } from "typeorm";
import { Practice_Card } from "./practice_card";

@Entity()
export class Best_Practice_Card extends Practice_Card {

    @Column({nullable: false})
    carbon_loss: number;
}