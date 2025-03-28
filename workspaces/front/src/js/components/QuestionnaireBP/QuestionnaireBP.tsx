import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionnaireBP.module.css';
import useSocketManager from '@app/js/hooks/useSocketManager';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import { ClientEvents } from '@shared/client/ClientEvents';
import { BestPracticeAnswerType } from '@shared/common/Game';
import { Actor, Difficulty } from '@shared/common/Cards';

const QuestionnaireBP: React.FC<{ bestPracticeCard: { id: string; title: string; contents: string; carbon_loss: number } }> = ({ bestPracticeCard }) => {
    const [createMessage, setCreateMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState<BestPracticeAnswerType | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();
    const { sm } = useSocketManager();

    const answer = (option: BestPracticeAnswerType) => {
        setSelectedOption(option);
        sm.emit({
            event: ClientEvents.AnswerPracticeQuestion,
            data: {
                cardId: bestPracticeCard.id, // Utiliser l'ID de la carte BestPractice fournie
                answer: option,
                cardType: 'BestPractice'
            }
        });
        setCreateMessage(`Vous avez classé la bonne pratique comme ${option}`);
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.cardContainer}>
                <BestPracticeCard cardType="BestPractice" id={bestPracticeCard.id} title={bestPracticeCard.title} contents={bestPracticeCard.contents} carbon_loss={bestPracticeCard.carbon_loss} network_gain={false} memory_gain={false} cpu_gain={false} storage_gain={false} difficulty={Difficulty.ONE} actor={Actor.ARCHITECT} />
            </div>
            <div className={styles.questionnaireContainer}>
                <label className={styles.label}>Sur votre projet, la bonne pratique est-elle :</label> <br />
                <button className={`${styles.button} ${selectedOption === BestPracticeAnswerType.APPLICABLE ? styles.selected : ''}`} onClick={() => answer(BestPracticeAnswerType.APPLICABLE)}>Applicable</button> <br />
                <button className={`${styles.button} ${selectedOption === BestPracticeAnswerType.ALREADY_APPLICABLE ? styles.selected : ''}`} onClick={() => answer(BestPracticeAnswerType.ALREADY_APPLICABLE)}>Déjà appliquée</button> <br />
                <button className={`${styles.button} ${selectedOption === BestPracticeAnswerType.NOT_APPLICABLE ? styles.selected : ''}`} onClick={() => answer(BestPracticeAnswerType.NOT_APPLICABLE)}>Non applicable</button> <br />
                {createMessage && <p className={styles.message}>{createMessage}</p>}
            </div>
        </div>
    );
};

export default QuestionnaireBP;