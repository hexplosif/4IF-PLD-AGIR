import React, { useMemo, useState } from 'react';
import styles from './PracticeQuestion.module.css';
import useSocketManager from '@app/js/hooks/useSocketManager';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import { ClientEvents } from '@shared/client/ClientEvents';
import { BadPracticeAnswerType, BestPracticeAnswerType } from '@shared/common/Game';
import { Card, Practice_Card } from '@shared/common/Cards';
import Quiz from '@app/components/question/quiz';
import { GameCard } from '@app/components/card';

const PracticeQuestion: React.FC<{ card: Practice_Card }> = ({ card }) => {
    const { sm } = useSocketManager();
    const [message, setMessage] = useState("");
    const bestPracticeAnswers = useMemo(() => [
        { type: BestPracticeAnswerType.APPLICABLE, label: 'Applicable' },
        { type: BestPracticeAnswerType.ALREADY_APPLICABLE, label: 'Déjà appliquée' },
        { type: BestPracticeAnswerType.NOT_APPLICABLE, label: 'Non applicable' }
    ], []);

    const badPracticeAnswers = useMemo(() => [
        { type: BadPracticeAnswerType.TO_BE_BANNED, label: 'Bannissable' },
        { type: BadPracticeAnswerType.ALREADY_BANNED, label: 'Déjà bannie' },
        { type: BadPracticeAnswerType.TOO_COMPLEX, label: 'Compliquée à éviter' }
    ], []);

    const handleAnswer = (index: number) => {
        console.log(index);
        const ans = card.cardType === 'BestPractice' ? bestPracticeAnswers[index] : badPracticeAnswers[index];
        sm.emit({
            event: ClientEvents.AnswerPracticeQuestion,
            data: {
                cardId: card.id,
                answer: ans.type,
                cardType: card.cardType,
            }
        });
        setMessage(`Vous avez classé la ${card.cardType === 'BestPractice' ? 'bonne' : 'mauvaise'} pratique comme ${ans.label}`);
    }

    const renderOptions = () => {
        if (card.cardType === "BestPractice") {
            return bestPracticeAnswers.map((answer) => ({label: answer.label}) );
        }
        return badPracticeAnswers.map((answer) => ({label: answer.label}));
    };

    return (
        <Quiz
            questionTitle='Practice Survey'
            questionText={`Sur votre projet, la ${card.cardType === 'BestPractice' ? 'bonne' : 'mauvaise'} pratique est-elle :`}
        
            options={renderOptions()}
            onAnswer={handleAnswer}
            correctAnswerIndex={null}

            resultMessages={message}
            simulationImage={<GameCard card={card as Card}/>}
        />
    );
};

export default PracticeQuestion;