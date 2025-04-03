import React, { useEffect, useMemo } from 'react'; 
import styles from './CardDeck.module.css'; // File CSS Module cho CardDeck
import BackCard from '@app/components/card/backCard/backCard';
import { Card } from '@shared/common/Cards';
import { FlipCard, GameCard } from '@app/components/card';
import anime from 'animejs';
import { Trans } from 'react-i18next';

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

    drawCard?: Card | null; // this is for draw card animation, only for flip = false
    drawToPosition?: "top" | "bottom" | "left" | "right"; // this is for draw card animation, only for flip = false
    onFinishDrawCard?: () => void; // this is called when the draw card animation is finished
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

    drawCard = null,
    drawToPosition, 
    onFinishDrawCard = () => {},
}) => {
    // get value from data-tooltip
    const isEmpty = useMemo(() => flip ? cards.length === 0 : count === 0, [flip, cards, count]);
    const [ isCardDrawFlipped, setIsCardDrawFlipped ] = React.useState(false);

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

    const lastCardStyle = {
        transform: `translate(${(count - 1) * offset}px, ${(count - 1) * offset}px)`,
        zIndex: 10,
        width: `${widthCard}px`,
        height: `${widthCard / 1.5 * 2.5}px`,
    } as React.CSSProperties;

    useEffect(() => { // Stack Animation
        // anime({ 
        //     targets: `.${styles.deckContainer} .${styles.cardWrapper}:last-child`,
        //     translateY: [-cardHeight, 0],
        //     opacity: [0, 1],
        //     duration: 600,
        //     easing: 'easeInOutQuad',
        //     delay: anime.stagger(100),
        //     loop: false,
        //     autoplay: true,
        // })
    }, [count, cards]);

    useEffect(() => { // Draw Animation
        if (!drawCard) return;

        if (drawToPosition === "bottom") {
            anime({
                targets: `.${styles.animationCard}`,
                bottom: '50%',     right: '50%',
                translateY: '50%', translateX: '50%',
                zIndex: 1000,
                rotateZ: [0, 360],
                duration: 500,
                easing: 'easeInOutQuad',
                
                complete: () => {
                    setIsCardDrawFlipped(true);
                    anime({
                        targets: `.${styles.animationCard}`,
                        scale: 2,
                        duration: 500,
                        easing: 'easeInOutQuad',
                        complete: () => {
                            anime({
                                targets: `.${styles.animationCard}`,
                                bottom: '20%',
                                scale: 0.5,
                                opacity: 0,
                                duration: 500,
                                delay: 1000, // 1s for player see the card
                                easing: 'easeInOutQuad',
                                complete: () => {
                                    setIsCardDrawFlipped(false);
                                    onFinishDrawCard();
                                },
                            })
                        },
                    });
                },
            });
            return;
        }
        
        let posRight = '50%';
        let posBottom = '50%';
        let degRotation = 360;

        switch (drawToPosition) {
            case "left":
                posRight = '85%';
                degRotation = 270;
                break;
            case "right":
                posRight = '15%';
                degRotation = 90;
                break;
            case "top":
                posBottom = '85%';
                degRotation = 180;
                break;
        }

        anime({
            targets: `.${styles.animationCard}`,
            bottom: posBottom,          right: posRight,
            translateY: '50%',     translateX: '50%',
            rotateZ: [0, degRotation],
            duration: 500,
            easing: 'easeOutSine',
            complete: () => {
                onFinishDrawCard();
            },
        })
    }, [drawCard]);

    return (
        <>
            {drawCard && !flip && 
                <div className={`${styles.animationCard} ${ isCardDrawFlipped ? styles.flippedDrawCard : '' } ${className}`} style={lastCardStyle}>
                    <FlipCard card={drawCard} width={widthCard} flipped={isCardDrawFlipped}/>
                </div>
            }
            <div data-tooltip={dataTooltip} className={`${styles.deckContainer} ${className}`} style={stackStyle}>
                {isEmpty && <div className={styles.emptyDeck} style={{
                    width: widthCard, borderRadius: widthCard / 10, fontSize: widthCard / 6,
                    borderColor: placeholderColor, color: placeholderColor  }}>{placeholder}</div>}
                {flip ? getFlippedCards() : getNotFlippedCards()}
            </div>
        </>

    );
};

export default CardDeck;