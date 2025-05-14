import React, { useEffect, useMemo } from 'react'; 
import styles from './CardDeck.module.css';
import BackCard from '@app/components/card/backCard/backCard';
import { Card } from '@shared/common/Cards';
import { FlipCard, GameCard } from '@app/components/card';
import anime from 'animejs';
import { useTranslation } from 'react-i18next';
import { useAnimationManager } from '@app/js/hooks/useAnimationManager';
import { AnimationType } from '@app/js/hooks/useAnimationManager/constants';

interface CardDeckProps {
    flip?: boolean;
    cards?: Card[];
    count?: number;
    widthCard?: number;
    offset?: number;
    className?: string;
    dataTooltip?: string;
    placeholder?: string;
    placeholderColor?: string;
    drawCard?: Card | null;
    drawToPosition?: "top" | "bottom" | "left" | "right";
    onFinishDrawCard?: () => void;
}

const CardDeck: React.FC<CardDeckProps> = ({
    flip = false,
    cards = [],
    count = 5,
    widthCard,
    offset = -3,
    className = "",
    dataTooltip,
    placeholder,
    placeholderColor = "#35353580",
    drawCard = null,
    drawToPosition, 
    onFinishDrawCard = () => {},
}) => {
    const { t } = useTranslation('game');
    const {putIfExists} = useAnimationManager();
    const isEmpty = useMemo(() => flip ? cards.length === 0 : count === 0, [flip, cards, count]);
    const [ isCardDrawFlipped, setIsCardDrawFlipped ] = React.useState(false);
    
    const defaultPlaceholder = t('deck.empty');

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

        const anim = anime.timeline({
            targets: `.${styles.animationCard}`,
            zIndex: 100000,
            autoplay: false,
            easing: 'easeInOutQuad',
            duration: 500,
        })

        if (drawToPosition === "bottom") {
            anim.add({ // move card to center
                bottom: '50%',     right: '50%',
                translateY: '50%', translateX: '50%',
                rotateZ: [0, 360],
                complete: () => setIsCardDrawFlipped(true), // flip card
            })
            .add ({ // zoom card
                scale: 2,
            })
            .add({ // hide card
                bottom: '20%',
                scale: 0.5,
                opacity: 0,
                complete: () => {
                    setIsCardDrawFlipped(false);
                    onFinishDrawCard();
                }
            }, '+=1000') // wait for 1s for player to see the card

            return putIfExists(AnimationType.DrawCard, anim);
        }
        
        let posRight = '50%';
        let posBottom = '50%';
        let degRotation = 360;

        switch (drawToPosition) {
            case "left":
                posRight = '85%';
                degRotation = 185;
                break;
            case "right":
                posRight = '15%';
                degRotation = 175;
                break;
            case "top":
                posBottom = '85%';
                degRotation = 180;
                break;
        }

        anim.add({
            bottom: posBottom,          right: posRight,
            translateY: '50%',     translateX: '50%',
            rotateZ: [0, degRotation],
            easing: 'easeOutSine',
            complete: () => {
                onFinishDrawCard();
            },
        })
        return putIfExists(AnimationType.DrawCard, anim);
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
                    borderColor: placeholderColor, color: placeholderColor  }}>{placeholder || defaultPlaceholder}</div>}
                {flip ? getFlippedCards() : getNotFlippedCards()}
            </div>
        </>
    );
};

export default CardDeck;