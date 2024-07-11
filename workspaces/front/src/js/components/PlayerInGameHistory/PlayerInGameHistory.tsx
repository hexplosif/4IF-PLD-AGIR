import React, { useState } from 'react';

import styles from './PlayerInGameHistory.module.css';

import BestPracticeCard from '@app/js/components/BestPracticeCard/BestPracticeCard';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import FormationCard from '../FormationCard/FormationCard';
import EmptyCard from '../EmptyCard/EmptyCard';
import { Card } from '@shared/common/Cards';

import { BaseCard } from '@shared/common/Cards';

function PlayerInGameHistory({Cards} : {Cards: Card[]}) {

    const defaultCards: Card[] = [
        { cardType: 'EmpyCard','id': '1', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
        { cardType: 'EmpyCard','id': '2', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
        { cardType: 'EmpyCard','id': '3', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' }
    ];
    
    const lastThreeCards = Cards.slice(-3);

    const cards = [...defaultCards.slice(0, 3 - lastThreeCards.length),...lastThreeCards];


    return (
        <div className={styles.hand}>
            {cards.slice(-3).map((card, index) => (
                <div key={index} className={`${styles.hand}`}>
                    {card.cardType === 'BestPractice' && (
                        <BestPracticeCard
                            cardType={card.cardType}
                            id={card.id}
                            title={card.title}
                            contents={card.contents}
                            carbon_loss={card.carbon_loss}
                            network_gain={card.network_gain}
                            memory_gain={card.memory_gain}
                            cpu_gain={card.cpu_gain}
                            storage_gain={card.storage_gain}
                            actor={card.actor}
                            difficulty={card.difficulty}
                        />
                    )}
                    {card.cardType === 'BadPractice' && (
                        <BadPracticeCard
                            cardType={card.cardType}
                            id={card.id}
                            title={card.title}
                            contents={card.contents}
                            targetedPlayerId={card.targetedPlayerId}
                            actor={card.actor}
                            network_gain={card.network_gain}
                            memory_gain={card.memory_gain}
                            cpu_gain={card.cpu_gain}
                            storage_gain={card.storage_gain}
                            difficulty={card.difficulty}
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
                            contents={card.contents}
                            linkToFormation={card.linkToFormation}
                        />
                    )}
                    {card.cardType !== 'BestPractice' && card.cardType !== 'BadPractice' && card.cardType !== 'Expert' && card.cardType !== 'Formation' && (
                        <>
                        <EmptyCard/>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default PlayerInGameHistory;
