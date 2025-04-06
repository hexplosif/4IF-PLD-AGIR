import React, { useEffect, useRef, useState } from 'react';
import styles from './cardList.module.css';
import anime from 'animejs';
import { Card } from '@shared/common/Cards';
import { FlipCardProps } from '@app/components/card/flipCard/flipCard';
import { useAnimationManager } from '@app/js/hooks/useAnimationManager';
import { AnimationType } from '@app/js/hooks/useAnimationManager/constants';

interface CardListProps {
    cardElements: React.ReactNode[];
    cardWidth: number;
    isCurve?: boolean;
    overlapFactor?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';

    playCard?: Card;
    onFinishPlayCard?: () => void;

    discardCardIndex?: number;
    onFinishDiscardCard?: () => void;
}

const maxCardRotation = 5;
const maxHandFanAngle = 60;
const handCurveAmount = 25;

const rotationDirection = {
    left: 90,
    right: -90,
    up: 0,
    down: 180,
}

const CardList: React.FC<CardListProps> = ({
    cardElements,
    isCurve = false,
    cardWidth,
    overlapFactor = 0.6,
    className = '',
    direction = 'down',

    playCard,
    onFinishPlayCard,
    
    discardCardIndex = null,
    onFinishDiscardCard,
}) => {
    const { putIfExists } = useAnimationManager();
    const [ isCardDrawFlipped, setIsCardDrawFlipped ] = useState(false);
    const nbCards = cardElements.length;

    const renderCardsInHand = () => cardElements.map((element, index) => {
        
        // --- Calculate position and rotation for fan effect ---
        let rotationAngle = 0;
        const actualFanAngle = Math.min(nbCards * maxCardRotation * 2, maxHandFanAngle);
        if (nbCards > 1) {
          const rotationRatio = (index / (nbCards - 1)) - 0.5;
          rotationAngle = rotationRatio * actualFanAngle;
        }

        const cardSpacing = cardWidth * (1 - overlapFactor);
        const totalCardsWidth = (nbCards - 1) * cardSpacing; 
        const handStartX = `calc(50% - ${cardWidth / 2}px - ${totalCardsWidth / 2}px)`;
        const leftPosition = `calc(${handStartX} + ${index * cardSpacing}px)`;

        let verticalOffset = 0;
        if (nbCards > 1) {
            const curveRatio = Math.abs((index / (nbCards - 1)) - 0.5) * 2; 
            verticalOffset = handCurveAmount * (1 - curveRatio * curveRatio);
        }

        const isLastCard = index === cardElements.length - 1;
        const isPlayingLastCard = isLastCard && playCard;
        const isDiscardingCard = index === discardCardIndex;
        const isAnimatingCard = isPlayingLastCard || isDiscardingCard;

        const cardStyle: React.CSSProperties = {
            left: leftPosition,
            zIndex: isDiscardingCard ? 999 : index, // Ensure discarding card is on top
            transform: isCurve ? `translateY(${-verticalOffset}px) rotate(${rotationAngle}deg)` : ``,
            boxShadow: isAnimatingCard 
                ? 'none' 
                : 'rgba(50, 50, 93, 0.45) 0px 6px 12px -2px, rgba(0, 0, 0, 0.5) 0px 3px 7px -3px' 
        };

        let cardToRender = element;
        
        if (isPlayingLastCard) {
            cardToRender = React.cloneElement(element as React.ReactElement<FlipCardProps>, { flipped: isCardDrawFlipped });
        }

        const classNames = `${styles.cardWrapper} ${isDiscardingCard ? styles.discarding : ''}`;

        return (
            <div key={index} className={classNames} style={cardStyle}>
                {cardToRender}
            </div>
        );
    });

    const rotationStyle : React.CSSProperties = {
        transformOrigin: 'center center',
        transform: `rotate(${rotationDirection[direction]}deg)`,
    };

    useEffect(() => {
        if (!playCard) return;

        let rotateZ : number;
        let translateY : number = -400;
        switch (direction) {
            case 'left': 
                rotateZ = 270; 
                break;
            case 'right': 
                rotateZ = -270; 
                break;
            case 'up': 
                rotateZ = 180; 
                translateY = -200;
                break;
            case 'down': 
                rotateZ = 180; 
                translateY = -200;
                break;
        }

        const anim = anime.timeline({
            targets: `.${styles.cardsInHandContainer} .${styles.cardWrapper}:last-child`,
            easing: 'easeInOutQuad',
            duration: 500,
            autoplay: false,
        })
        .add({
            translateY: translateY, translateX: -100,
            rotate: 0,
            rotateZ: {
                value: rotateZ,
                easing: 'linear',
            },
            zIndex: 1000,
            complete: () => { setIsCardDrawFlipped(true); },
        })
        .add({
            scale: 2,
            easing: 'easeInOutQuad',
        })
        .add({
            scale: 0.5,
            opacity: 0,
            easing: 'easeInOutQuad',
            complete: () => {
                onFinishPlayCard?.();
                setIsCardDrawFlipped(false);
            },
        }, "+=1000") // 1s for player see the card;
        
        putIfExists(AnimationType.PlayCard, anim);
    }, [playCard]);

    // New useEffect for discard animation
    useEffect(() => {
        if (discardCardIndex === null) return;

        // Target the specific card being discarded using the index
        const anim = anime.timeline({
            targets: `.${styles.cardsInHandContainer} .${styles.discarding}`,
            easing: 'easeInOutQuad',
            duration: 500,
            autoplay: false,
        })
        .add({
            // Fly away to discard pile (bottom-right)
            translateY: direction === 'down' ? -500 : -800,
            translateX: -100,
            boxShadow: [
                { value: '0 0 10px 5px rgba(255,0,0,0.5)', duration: 300 },
            ],
            rotate: 0,
            rotateZ: {
                value: 180 * Math.random(),
                easing: 'linear',
            },
            scale: 0.7,
            duration: 700,
        })
        .add({
            // Fade out
            opacity: 0,
            scale: 0.3,
            easing: 'easeOutQuad',
            duration: 300,
            complete: () => {
                onFinishDiscardCard?.();
            },
        });
        
        putIfExists(AnimationType.DiscardCard, anim);
    }, [discardCardIndex]);

    return (
        <div className={`${styles.cardsInHandContainer} ${className} `} style={rotationStyle}>
            {renderCardsInHand()}
        </div>
    );
};

export default CardList;