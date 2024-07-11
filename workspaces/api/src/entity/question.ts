import { Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question_Answer } from "./question_answer";
import { Question_Content } from "./question_content";
import { Game } from "./game";

@Entity()
export class Question {
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Question_Answer, question_answer => question_answer.question)
    question_answers: Question_Answer[];

    @OneToMany(() => Question_Content, question_content => question_content.question)
    question_contents: Question_Content[];

    @ManyToMany(() => Game, game => game.questions)
    @JoinTable({ name: 'questions_games'})
    games: Game[];

    
public getQuestion_Content(){
    return this.question_contents;
}

}