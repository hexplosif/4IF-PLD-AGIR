import React, { useState } from 'react';
import styles from './MyEndGameSummary.module.css';
import { Card } from '@shared/common/Cards';
import { useTranslation } from "react-i18next";
import { GameCard } from '@app/components/card';

const MyEndGameSummary: React.FC<{ cards: Card[] }> = ({ cards }) => {
    const data = cards;
    const { t } = useTranslation('summary', { keyPrefix: 'player-summary' });
    const [isVisible, setIsVisible] = useState(true);
    const [startBPIndex, setStartBPIndex] = useState(0);
    const [startMPIndex, setStartMPIndex] = useState(0);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    if (!isVisible) {
        return null;
    }

    const nextBP = () => {
        if (startBPIndex + 3 < data.filter(card => card.cardType === 'BestPractice').length) {
            setStartBPIndex(startBPIndex + 1);
        }
    };

    const prevBP = () => {
        if (startBPIndex > 0) {
            setStartBPIndex(startBPIndex - 1);
        }
    };

    const nextMP = () => {
        if (startMPIndex + 3 < data.filter(card => card.cardType === 'BadPractice').length) {
            setStartMPIndex(startMPIndex + 1);
        }
    };

    const prevMP = () => {
        if (startMPIndex > 0) {
            setStartMPIndex(startMPIndex - 1);
        }
    };

    const handleCardClick = (card: Card) => {
        setSelectedCard(card);
    };

    const handleCloseCard = () => {
        setSelectedCard(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.myBestPracticeContainer}>
            <label className={styles.label}>{t('bp-label')}</label>
            <div className={styles.cardContainer}>
                {(data.filter(card => card.cardType === 'BestPractice')).slice(startBPIndex, startBPIndex + 3).map((card, index) => (
                    <div key={`BP${index}`} className={styles.card} onClick={() => handleCardClick(card)}>
                        <GameCard
                            width={250}
                            card={card}
                        />
                    </div>
                ))}
            </div>
            </div>
            <div className={styles.myBadPracticeContainer}>
            <label className={styles.label}>{t('mp-label')}</label>
            <div className={styles.cardContainer}>
                {(data.filter(card => card.cardType === 'BadPractice')).slice(startMPIndex, startMPIndex + 3).map((card, index) => (
                    <div key={`MP${index}`} className={styles.card} onClick={() => handleCardClick(card)}>
                        <GameCard
                            width={250}
                            card={card}
                        />
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

export default MyEndGameSummary;
