import React, { useMemo, useState } from 'react';
import styles from './PracticeQuestion.module.css';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { BadPracticeAnswerType, BestPracticeAnswerType } from '@shared/common/Game';
import { Card, Practice_Card } from '@shared/common/Cards';
import { GameCard } from '@app/components/card';
import { GameModeQuiz } from "@app/components/question";
import { useTranslation } from "react-i18next";

const PracticeQuestion: React.FC<{ card: Practice_Card }> = ({ card }) => {
    const { t } = useTranslation('questions');

    const { sm } = useSocketManager();
    const [message, setMessage] = useState("");
    const bestPracticeAnswers = useMemo(() => [
        { type: BestPracticeAnswerType.APPLICABLE, label: t('practice-question.applicable') },
        { type: BestPracticeAnswerType.ALREADY_APPLICABLE, label: t('practice-question.already-applicable') },
        { type: BestPracticeAnswerType.NOT_APPLICABLE, label: t('practice-question.not-applicable') }
    ], []);

    const badPracticeAnswers = useMemo(() => [
        { type: BadPracticeAnswerType.TO_BE_BANNED, label: t('practice-question.to-be-banned') },
        { type: BadPracticeAnswerType.ALREADY_BANNED, label: t('practice-question.already-banned') },
        { type: BadPracticeAnswerType.TOO_COMPLEX, label: t('practice-question.too-complex') }
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
        setMessage(`${t('practice-question.message-text-1')} ${card.cardType === 'BestPractice' ? t('practice-question.good') : t('practice-question.bad')} ${t('practice-question.message-text-2')} ${ans.label}`);
    }

    const renderOptions = () => {
        if (card.cardType === "BestPractice") {
            return bestPracticeAnswers.map((answer) => ({ label: answer.label }));
        }
        return badPracticeAnswers.map((answer) => ({ label: answer.label }));
    };

    return (
        <GameModeQuiz
            questionTitle={t('practice-question.title')}
            questionText={`${t('practice-question.question-text-1')} ${card.cardType === 'BestPractice' ? t('practice-question.good') : t('practice-question.bad')} ${t('practice-question.question-text-2')} :`}

            options={renderOptions()}
            onAnswer={handleAnswer}
            correctAnswerIndex={null}

            resultMessages={message}
            simulationImage={
                <GameCard
                    card={card as Card}
                    width={420}
                    className={styles.practiceQuestionCard}
                />
            }
        />
    );
};

export default PracticeQuestion;