import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyEndGameSummary.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import next from '@app/icons/next.webp';
import { Bad_Practice_Card, Best_Practice_Card, Card } from '@shared/common/Cards';

const MyEndGameSummary: React.FC <{cards : Card[]}> = ({ cards }) => {
        const data = cards;

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
            <label className={styles.label}>Mes bonnes pratiques applicables</label><br />
            <div className={styles.cardContainer}>
                {(data.filter(card => card.cardType === 'BestPractice') as Best_Practice_Card[]).slice(startBPIndex, startBPIndex + 3).map((card, index) => (
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
            <div className={styles.navigationButtons}>
                {startBPIndex > 0 && <img src={next} alt="Previous" className={styles.prevButton} onClick={prevBP} />}
                {startBPIndex <= 0 && <img src="" alt="" className={styles.prevButton} onClick={prevBP} />}
                {startBPIndex + 3 < data.filter(card => card.cardType === 'BestPractice').length && <img src={next} alt="Next" className={styles.nextButton} onClick={nextBP} />}
            </div>
            <hr className={styles.separator} />
            <label className={styles.label}>Mes mauvaises pratiques à bannir</label><br />
            <div className={styles.cardContainer}>
                {(data.filter(card => card.cardType === 'BadPractice') as Bad_Practice_Card[]).slice(startMPIndex, startMPIndex + 3).map((card, index) => (
                    <div key={`MP${index}`} className={styles.card} onClick={() => handleCardClick(card)}>
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
            <div className={styles.navigationButtons}>
                {startMPIndex > 0 && <img src={next} alt="Previous" className={styles.prevButton} onClick={prevMP} />}
                {startMPIndex <= 0 && <img src="" alt="" className={styles.prevButton} onClick={prevMP} />}
                {startMPIndex + 3 < data.filter(card => card.cardType === 'BadPractice').length && <img src={next} alt="Next" className={styles.nextButton} onClick={nextMP} />}
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

export default MyEndGameSummary;
