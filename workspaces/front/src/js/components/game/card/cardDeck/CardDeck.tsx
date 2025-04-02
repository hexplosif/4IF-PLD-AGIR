import React, { useMemo } from 'react'; 
import styles from './CardDeck.module.css'; // File CSS Module cho CardDeck
import BackCard from '@app/components/card/backCard/backCard';
import { Card } from '@shared/common/Cards';
import { GameCard } from '@app/components/card';

interface CardDeckProps {
    flip?: boolean; // indicates if the card is flipped (true means cards are faces up)
    cards?: Card[];  // use this if flip = true
    count?: number; // use this if flip = false

    widthCard?: number;
    offset?: number;
    className?: string;
    dataTooltip?: string;

    placeholder?: string;
    placeholderColor?: string;
}

const CardDeck: React.FC<CardDeckProps> = ({
    flip = false,
    cards = [],
    count = 5,

    widthCard,
    offset = -3,
    className = "",
    dataTooltip,

    placeholder = "Empty Deck",
    placeholderColor = "#35353580",
}) => {
    // get value from data-tooltip
    const isEmpty = useMemo(() => flip ? cards.length === 0 : count === 0, [flip, cards, count]);

    const getNotFlippedCards = () => Array.from({ length: count }).map((_, index) => {
        const cardStyle = {
            transform: `translate(${index * offset}px, ${index * offset}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
        } as React.CSSProperties;

        return (
            <div key={index} style={cardStyle} className={styles.cardWrapper}>
                <BackCard width={widthCard} />
            </div>
        );
    });

    const getFlippedCards = () => cards.map((card, index) => {
        const cardStyle = {
            transform: `translate(${index * offset}px, ${index * offset}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
        } as React.CSSProperties;

        return (
            <div key={index} style={cardStyle} className={styles.cardWrapper}>
                <GameCard card={card} width={widthCard} />
            </div>
        );
    });

    const cardHeight = widthCard * (2.5 / 1.5);

    const stackStyle = {
        width: `${widthCard}px`,
        height: `${cardHeight}px`,
    };

    return (
        <div data-tooltip={dataTooltip} className={`${styles.deckContainer} ${className}`} style={stackStyle}>
            {isEmpty && <div className={styles.emptyDeck} style={{
                width: widthCard, borderRadius: widthCard / 10, fontSize: widthCard / 6,
                borderColor: placeholderColor, color: placeholderColor  }}>{placeholder}</div>}
            {flip ? getFlippedCards() : getNotFlippedCards()}
        </div>
    );
};

export default CardDeck;