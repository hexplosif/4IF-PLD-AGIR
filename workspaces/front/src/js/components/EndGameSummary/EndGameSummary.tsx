import { Card } from '@shared/common/Cards';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './EndGameSummary.module.css';
import { GameCard } from '@app/components/card';

const EndGameSummary: React.FC<{ cards: Card[] }> = ({ cards }) => {
    const data = cards;
    const { t } = useTranslation('summary', { keyPrefix: 'overall-summary' });
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
                    {(data.filter(card => card.cardType === 'BestPractice')).map((card, index) => (
                        <div key={`BP${index}`} className={styles.card} onClick={() => handleCardClick(card)}>
                            <GameCard
                                width={250}
                                card={card}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.badPracticeContainer}>
                <label className={styles.label}>{t('top-mp-label')}</label><br />
                <div className={styles.cardContainer}>
                    {(data.filter(card => card.cardType === 'BadPractice')).map((card, index) => (
                        <div key={`BP${index}`} className={styles.card} onClick={() => handleCardClick(card)}>
                            <GameCard
                                width={250}
                                card={card}
                            />
                            <span className={styles.cardNumber}>{index + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {selectedCard && (
                <div className={styles.modalBackdrop} onClick={handleCloseCard}>
                    <div className={`${styles.modalContent} ${styles.bigCard}`}>
                        <GameCard
                            width={350}
                            card={selectedCard}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EndGameSummary;
