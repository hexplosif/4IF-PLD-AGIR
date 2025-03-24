import React, { useState } from 'react';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import styles from './OpponentBoard.module.css';
import userIcon from '@app/assets/icons/user_icon.webp';
import lockerIcon from '@app/assets/icons/locked.webp';
import PlayerStatus from '../PlayerStatus/PlayerStatus';
import { PlayerStateInterface } from '@shared/common/Game';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import FormationCard from '../FormationCard/FormationCard';
import EmptyCard from '../EmptyCard/EmptyCard';
import CardsHistory from '../CardsHistory/CardsHistory';
import { Actor, BaseCard, Difficulty } from '@shared/common/Cards';

function OpponentBoard({ playerState, myTurn }: { playerState: PlayerStateInterface , myTurn: boolean}) {
    //console.log('PlayerState dans oponnentBoard', playerState);

    const [historyDisplay, setHistoryDisplay] = useState(false);

    const lastThreeCards = playerState.cardsHistory.slice(-3);


    // Cartes par défaut
    const defaultCards: BaseCard[] = [
        { cardType: 'EmptyCard','id': '1', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' , actor: Actor.ARCHITECT},
        { cardType: 'EmptyCard','id': '2', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' , actor: Actor.ARCHITECT},
        { cardType: 'EmptyCard','id': '3', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' , actor: Actor.ARCHITECT}
    ];

    const cards = [...defaultCards.slice(0, 3 - lastThreeCards.length),...lastThreeCards];

    const handleHistoryClick = () => {
        setHistoryDisplay(true);
    }
    

    return (
        <div className={styles.opponentBoard}>
            <div className={styles.nameContainer}> </div>
            <div className={`${styles.container} ${myTurn ? styles.containerMyTurn : ''}`}>
                <img src={userIcon} alt="user icon" className={`${styles.userIcon} ${myTurn ? styles.userIconMyTurn : ''}`} />
                {playerState.canPlay===false &&
                    <img src={lockerIcon} alt="locker icon" className={`${styles.lockerIcon} ${myTurn ? styles.lockerIconMyTurn : ''}`} />
                }       
                <label className={`${styles.labelname} ${myTurn ? styles.labelnameMyTurn : ''}`}>{playerState.playerName}</label>
                
                <div className={styles.container2}>
                    <PlayerStatus playerstate={playerState} me={0} />
                </div>

                <div className={styles.opponentHistory}
                onClick={() => handleHistoryClick()}>

                    {cards.slice(-3).map((card, index) => (
                        <div key={index} className={`${styles.card}`}>
                            {card.cardType === 'BestPractice' && (
                                <BestPracticeCard
                                    cardType={card.cardType}
                                    id={card.id}
                                    title={card.title}
                                    contents={card.contents}
                                    carbon_loss={100} network_gain={false} memory_gain={false} cpu_gain={false} storage_gain={false} difficulty={Difficulty.ONE} actor={Actor.PRODUCT_OWNER} />
                            )}
                            {card.cardType === 'BadPractice' && (
                                <BadPracticeCard
                                    cardType={card.cardType}
                                    id={card.id}
                                    title={card.title}
                                    contents={card.contents}
                                    difficulty={Difficulty.ONE}
                                    actor={card.actor}
                                    network_gain={false}
                                    storage_gain={false}
                                    memory_gain={false}
                                    cpu_gain={false}
                                />
                            )}
                            {card.cardType === 'Expert' && (
                                <ExpertCard
                                    cardType={card.cardType}
                                    id={card.id}
                                    actor={card.actor}
                                    title={card.title}
                                    contents={card.contents}
                                />
                            )}
                            {card.cardType === 'Formation' && (
                                <FormationCard
                                    cardType={card.cardType}
                                    id={card.id}
                                    actor={card.actor}
                                    title={card.title}
                                    contents={card.contents} linkToFormation={''} />
                            )}
                            {card.cardType === 'EmptyCard' && (
                                <EmptyCard/>
                            )}
                        </div>
                    ))}
                </div>

                {historyDisplay && (
                    <>
                    <div className={styles.fond}></div>
                        <CardsHistory cards={playerState.cardsHistory} />
                        <div className={styles.closeButton} onClick={() => setHistoryDisplay(false)}>X</div>
                    </>
                )}
            </div>

        </div>

    );
};

export default OpponentBoard;