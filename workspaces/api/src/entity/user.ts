import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User_Game } from "./user_game";
import { Exclude } from 'class-transformer';
import { Green_IT_Booklet } from "./green_it_booklet";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    first_name: string

    @Column({nullable: false})
    last_name: string;

    @Column({nullable: false})
    mail: string;

    @Column({nullable: false})
    @Exclude()
    password: string;

    @OneToMany(() => User_Game, (user_game) => user_game.user )
    user_games: User_Game[]
    
    @Column({nullable: true}) // Permettre la valeur nulle
    green_it_booklet_id: number;

    @OneToOne(() => Green_IT_Booklet, green_it_booklet => green_it_booklet.user, { nullable: true })
    @JoinColumn({ name: "green_it_booklet_id" })
    green_it_booklet: Green_IT_Booklet;
}