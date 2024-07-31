import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Practice_Card } from "./practice_card";
import { Green_IT_Booklet_Best_Practice_Card } from "./green_it_booklet_best_practice_card";
import { Green_IT_Booklet } from "./green_it_booklet";

@Entity()
export class Best_Practice_Card extends Practice_Card {

    @Column({nullable: false})
    carbon_loss: number;
    
    @ManyToMany(() => Green_IT_Booklet, greenITBooklet => greenITBooklet.practices_to_apply)
    @JoinTable()
    green_it_booklet_practices_to_apply: Green_IT_Booklet_Best_Practice_Card[];
}