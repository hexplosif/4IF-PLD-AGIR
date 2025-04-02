import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question";
import { Language } from "@shared/common/Languages";

@Entity()
export class Question_Content {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    question_id : number;

    @Column({nullable: false})
    language: Language;

    @Column({nullable: false})
    description: string;

    @Column("jsonb", { nullable: false })
    responses: string[];

    @ManyToOne(() => Question, (question) => question.question_contents)
    @JoinColumn({ name: "question_id" })
    question: Question;
}