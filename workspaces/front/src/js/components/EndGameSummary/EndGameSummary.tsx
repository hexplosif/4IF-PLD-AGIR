import React, { useState } from 'react';
import styles from './EndGameSummary.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import { Bad_Practice_Card, Best_Practice_Card, Card } from '@shared/common/Cards';
import { useTranslation } from "react-i18next";

const EndGameSummary: React.FC <{cards : Card[]}> = ({ cards }) =>  {
    const data = cards;

    const { t } = useTranslation('summary', {keyPrefix:'overall-summary'});

    const [isVisible, setIsVisible] = useState(true);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);


    if (!isVisible) {
        return null;
    }

    const handleCardClick = (card: Card) => {
        setSelectedCard(card);
    };
    
    const handleCloseCard = () => {
        setSelectedCard(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.bestPracticeContainer}>
            <label className={styles.label}>{t('top-bp-label')}</label>
            <div className={styles.cardContainer}>
                
            {(data.filter(card => card.cardType === 'BestPractice') as Best_Practice_Card[]).map((card, index) => (
                <div key={`BP${index}`} className={styles.card} onClick={() => handleCardClick(card)}>
                    <BestPracticeCard
                        cardType={card.cardType}
                        id={card.id}
                        title={card.title}
                        contents={card.contents}
                        carbon_loss={card.carbon_loss}
                        network_gain={card.network_gain}
                        cpu_gain={card.cpu_gain}
                        actor={card.actor}
                        memory_gain={card.memory_gain}
                        storage_gain={card.storage_gain}
                        difficulty={card.difficulty}
                    />
                </div>
            ))}
            </div>
            </div>
            <div className={styles.badPracticeContainer}>
            <label className={styles.label}>{t('top-mp-label')}</label><br />
            <div className={styles.cardContainer}>
                {(data.filter(card => card.cardType === 'BadPractice') as Bad_Practice_Card[]).map((card, index) => (
                    <div key={`BP${index}`} className={styles.card} onClick={() => handleCardClick(card)}>
                        <BadPracticeCard
                            cardType={card.cardType}
                            id={card.id}
                            title={card.title}
                            contents={card.contents}
                            network_gain={card.network_gain}
                            cpu_gain={card.cpu_gain}
                            actor={card.actor}
                            memory_gain={card.memory_gain}
                            storage_gain={card.storage_gain}
                            difficulty={card.difficulty}
                        />
                    </div>
                ))}
            </div>
            </div>

            {selectedCard && (
            <div className={styles.modalBackdrop} onClick={handleCloseCard}>
                <div className={`${styles.modalContent} ${styles.bigCard}`}>
                    {selectedCard.cardType === 'BestPractice' ? (
                        <BestPracticeCard
                            cardType={selectedCard.cardType}
                            id={selectedCard.id}
                            title={selectedCard.title}
                            contents={selectedCard.contents}
                            carbon_loss={selectedCard.carbon_loss}
                            network_gain={selectedCard.network_gain}
                            cpu_gain={selectedCard.cpu_gain}
                            actor={selectedCard.actor}
                            memory_gain={selectedCard.memory_gain}
                            storage_gain={selectedCard.storage_gain}
                            difficulty={selectedCard.difficulty}
     
                        />
                    ) : selectedCard.cardType === 'BadPractice' ? (
                        <BadPracticeCard
                            cardType={selectedCard.cardType}
                            id={selectedCard.id}
                            title={selectedCard.title}
                            contents={selectedCard.contents}
                            network_gain={selectedCard.network_gain}
                            cpu_gain={selectedCard.cpu_gain}
                            actor={selectedCard.actor}
                            memory_gain={selectedCard.memory_gain}
                            storage_gain={selectedCard.storage_gain}
                            difficulty={selectedCard.difficulty}                       />
                    ) : null}

                </div>
            </div>
)}

        </div>
    );
};

export default EndGameSummary;
