import { Entity, JoinTable, ManyToMany } from "typeorm";
import { Practice_Card } from "./practice_card";
import { Green_IT_Booklet_Bad_Practice_Card } from "./green_it_booklet_bad_practice_card";
import  { Green_IT_Booklet } from "./green_it_booklet";

@Entity()
export class Bad_Practice_Card extends Practice_Card {
    
        @ManyToMany(() => Green_IT_Booklet, greenITBooklet => greenITBooklet.practices_to_ban)
        @JoinTable()
        green_it_booklet_practices_to_ban: Green_IT_Booklet_Bad_Practice_Card[];
}