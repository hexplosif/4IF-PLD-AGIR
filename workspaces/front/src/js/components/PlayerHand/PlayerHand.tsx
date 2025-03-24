import React, { useState } from 'react';
import styles from './PlayerHand.module.css';

import BestPracticeCard from '../BestPracticeCard/BestPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import FormationCard from '../FormationCard/FormationCard';

import { BaseCard, Card } from '@shared/common/Cards';

import iconOk from '@app/assets/icons/ok_icon.webp';
import iconBin from '@app/assets/icons/bin_icon.webp';

import { Best_Practice_Card, Bad_Practice_Card, Expert_Card, Formation_Card } from '@shared/common/Cards';
import EmptyCard from '../EmptyCard/EmptyCard';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { PlayerStateInterface } from '@shared/common/Game';

function PlayerHand({ MPSelected, noMPSelected, playerState, myTurn }: {
  MPSelected: (card: Bad_Practice_Card) => void,
    noMPSelected: () => void,
    playerState: PlayerStateInterface,
    myTurn: boolean,
}) {

    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [typeSelected, setTypeSelected] = useState<string>("");
    const [MPblocked, setMPBlocked] = useState<string>(playerState.badPractice ? playerState.badPractice : "");

    const { sm } = useSocketManager();

    const handleCardClick = (cardId: number, card: Card) => {
        console.log("'[PlayerHand] playerstate", playerState, 'turn', myTurn);
        if (myTurn) {
                if (selectedCard === cardId) {
                    setSelectedCard(null);
                    noMPSelected();
                    return;
                }
                noMPSelected();
                setSelectedCard(cardId);
                setTypeSelected(card.cardType);
                if (card.cardType === "BadPractice") {
                    MPSelected(card);
                }
        }
        setMPBlocked(playerState.badPractice ? playerState.badPractice : "");
    };

    const handleCardHover = (cardId: number) => {
    };

    const handleCardLeave = (cardType: string) => {
            setSelectedCard(null);
    };

    const handlePlayCard = (card: Card) => {
        if(MPblocked === "" || MPblocked!=="" && card.cardType !== "BestPractice") {
        console.log("[playerHand] play card", card);
        sm.emit({
            event: ClientEvents.PlayCard,
            data: {
                card
            }
        })
    }
    }
    
    const handleDiscardCard = (card: Card) => {
        console.log("[Playerhand] discard card", card);
        sm.emit({
            event: ClientEvents.DiscardCard,
            data: {
                card
            }
        })
    }

    let cards = playerState.cardsInHand;

    return (
        <div className={styles.hand}>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`${styles.card} ${selectedCard === index ? styles.selected : ''}`}
                    onClick={() => handleCardClick(index,card)}
                    onMouseEnter={() => handleCardHover(index)}
                    onMouseLeave={() => handleCardLeave(card.cardType)}
                >
                    {card.cardType === 'BestPractice' && (
                        <BestPracticeCard cardType={card.cardType} id={card.id} title={card.title} contents={card.contents} carbon_loss={card.carbon_loss} difficulty={card.difficulty} actor={card.actor} network_gain={card.network_gain} memory_gain={card.memory_gain} cpu_gain={card.cpu_gain} storage_gain={card.storage_gain} />
                    )}
                    {card.cardType === 'BadPractice' && (
                        <BadPracticeCard cardType={card.cardType} id={card.id} title={card.title} contents={card.contents} targetedPlayerId={card.targetedPlayerId} actor={card.actor} difficulty={card.difficulty} network_gain={card.network_gain} memory_gain={card.memory_gain} cpu_gain={card.cpu_gain} storage_gain={card.storage_gain} />
                    )}
                    {card.cardType === 'Expert' && (
                        <ExpertCard cardType={card.cardType} id={card.id} actor={card.actor} title={card.title} contents={card.contents} />
                    )}
                    {card.cardType === 'Formation' && (
                        <FormationCard cardType={card.cardType} id={card.id} actor={card.actor} title={card.title} contents={card.contents} linkToFormation={''} />
                    )}
                    {(card.cardType !== "BadPractice" && !(card.cardType==="BestPractice" && MPblocked!=="")) && selectedCard === index &&
                        <div className={styles.tooltip}>
                            <img onClick={() => handlePlayCard(card)} className={styles.iconOk} src={iconOk} alt="iconOk" />
                            <span className={styles.tooltiptext} style={{ backgroundColor: "rgba(0, 105, 0, 0.8)" }}>Valider la carte</span>
                        </div>
                    }
                    {selectedCard === index && (
                        <div className={styles.tooltip}>
                            <img onClick={() => handleDiscardCard(card)} className={styles.iconBin} src={iconBin} alt="iconBin" />
                            <span className={styles.tooltiptext} style={{ backgroundColor: "rgba(165, 0, 0, 0.8)" }}>Défausser la carte</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default PlayerHand;
