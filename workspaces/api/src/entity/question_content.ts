import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question";

@Entity()
export class Question_Content {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    question_id : number;

    @OneToMany(() => Question, (question) => question.question_contents)
    @JoinColumn({ name: "question_id" })
    question: Question;

    @Column({nullable: false})
    language: string;

    @Column({nullable: false})
    label: string;

    @Column({nullable: false})
    description: string;

    @Column({nullable: false})
    response1: string;

    @Column({nullable: false})
    response2: string;

    @Column({nullable: false})
    response3: string;



public getDescription(){
    return this.description;
}

}