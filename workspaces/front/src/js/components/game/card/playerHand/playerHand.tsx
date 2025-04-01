import React, { } from 'react';
import { Card } from '@shared/common/Cards'; 
import styles from './PlayerHand.module.css'; 
import { DraggableCard } from '@app/components/card';

interface CardInHand {
    card: Card;
    canPlay: boolean;
}

interface PlayerHandProps {
    cards: CardInHand[];
    cardWidth?: number;
    className?: string;
    isTurnPlayer?: boolean;
}

const overlapFactor = 0.25;

const PlayerHand: React.FC<PlayerHandProps> = ({ 
    cards, 
    cardWidth = 120,
    className = '',
    isTurnPlayer = false,
}) => {
    const numCards = cards.length;

    const drawCards = () => {
        return cards.map((cardInHand, index) => {
    
            const cardSpacing = cardWidth * (1 - overlapFactor);
            const totalCardsWidth = (numCards - 1) * cardSpacing; 
            const handStartX = `calc(50% - ${cardWidth / 2}px - ${totalCardsWidth / 2}px)`;
            const leftPosition = `calc(${handStartX} + ${index * cardSpacing}px)`;

    
            const cardStyle: React.CSSProperties = {
              left: leftPosition,
              zIndex: index,
            };
    
            return (
                <DraggableCard
                    key={`card-${index}`} //cardInHand.card.id || 
                    card={cardInHand.card}
                    style={cardStyle}
                    className={`${styles.cardWrapper} ${cardInHand.canPlay ? styles.canPlay : ''}`}
                    width={cardWidth}
                    canPlay={isTurnPlayer && cardInHand.canPlay}
                />
            );
        })
    }

    return (
        <div className={`${styles.handContainer} ${isTurnPlayer ? '' : styles.notThisTurn} ${className}`} style={{ width: `${cardWidth * numCards}px` }}>
            <div className={styles.cardsContainer}>
                {drawCards()}
            </div>
            <div className={styles.cardsHolder} />
        </div>
  );
};

export default PlayerHand;