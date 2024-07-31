import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Bad_Practice_Card } from "./bad_practice_card";
import { Best_Practice_Card } from "./best_practice_card";

@Entity()
export class Green_IT_Booklet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    user_id: number;

    @OneToOne(() => User, user => user.green_it_booklet)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToMany(() => Bad_Practice_Card)
    @JoinTable()
    practices_to_ban: Bad_Practice_Card[];

    @ManyToMany(() => Best_Practice_Card)
    @JoinTable()
    practices_to_apply: Best_Practice_Card[];

}