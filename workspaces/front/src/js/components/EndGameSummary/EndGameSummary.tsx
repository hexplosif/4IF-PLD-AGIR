import React, { useState } from 'react';
import styles from './EndGameSummary.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import { Bad_Practice_Card, Best_Practice_Card, Card, Practice_Card } from '@shared/common/Cards';

const EndGameSummary: React.FC <{cards : Card[]}> = ({ cards }) =>  {
    const data = cards;

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
            <label className={styles.label}>Top 3 des bonnes pratiques à appliquer</label><br />
            <label className={styles.label2}>(selon les votes des joueurs)</label><br />
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
                    <span className={styles.cardNumber}>{index + 1}</span>
                </div>
            ))}
            </div>
            <hr className={styles.separator} />
            <label className={styles.label}>Top 3 des mauvaises pratiques à bannir</label><br />
            <label className={styles.label2}>(selon les votes des joueurs)</label><br />
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
                        <span className={styles.cardNumber}>{index + 1}</span>
                    </div>
                ))}
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
