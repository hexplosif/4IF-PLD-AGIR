import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question_Content } from "./question_content";
import { Game } from "./game";

@Entity()
export class Question {
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Question_Content, question_content => question_content.question)
    question_contents: Question_Content[];

    @Column({nullable: false})
    correct_response: number; // index of correct response, start from 1
}