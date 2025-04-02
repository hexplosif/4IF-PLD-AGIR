import React, { } from 'react';
import { Actor, Card } from '@shared/common/Cards';
import styles from './PlayerHand.module.css';
import { DraggableCard } from '@app/components/card';
import DevelopperIcon from "@app/assets/icons/svg/icon_developer.svg";
import ProductOwnerIcon from "@app/assets/icons/svg/icon_product_owner.svg";
import ArchitectIcon from "@app/assets/icons/svg/icon_lead_tech.svg";
import { ReactSVG } from 'react-svg';

interface CardInHand {
    card: Card;
    canPlay: boolean;
    cause: string;
}

interface PlayerHandProps {
    cards: CardInHand[];
    cardWidth?: number;
    className?: string;
    isTurnPlayer?: boolean;
    badPracticeApplied?: Actor | null;
}

const overlapFactor = 0.25;
const getIconFromActor = (actor: Actor) => {
    switch (actor) {
        case Actor.DEVELOPER:
            return <ReactSVG src={DevelopperIcon} wrapper="span"/>;
        case Actor.PRODUCT_OWNER:
            return <ReactSVG src={ProductOwnerIcon} wrapper="span"/>;
        case Actor.ARCHITECT:
            return <ReactSVG src={ArchitectIcon} wrapper="span"/>;
        default:
            return null;
    }
}

const PlayerHand: React.FC<PlayerHandProps> = ({ 
    cards,
    cardWidth = 120,
    className = '',
    isTurnPlayer = false,
    badPracticeApplied = null,
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
                    canDrag={isTurnPlayer}
                    cause={cardInHand.cause}
                />
            );
        })
    }
    
    const containerClass = `${styles.handContainer} ${isTurnPlayer ? '' : styles.notThisTurn} ${isTurnPlayer && badPracticeApplied ? styles.blocked : ''} ${className}`;
    
    return (
        <div className={containerClass} style={{ width: `${cardWidth * numCards}px` }}>
            <div className={styles.cardsContainer}>
                {drawCards()}
            </div>
            <div className={styles.cardsHolder}>
                {badPracticeApplied && (
                    <div className={styles.blockedIndicator}
                        data-tooltip={`To cancel block: play expert or formation ${badPracticeApplied} card`}
                    >
                        {getIconFromActor(badPracticeApplied)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerHand;