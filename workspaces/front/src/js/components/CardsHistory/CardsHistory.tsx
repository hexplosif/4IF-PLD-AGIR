import { Card, Difficulty } from "@shared/common/Cards";
import styles from './CardsHistory.module.css';
import BestPracticeCard from "../BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "../BadPracticeCard/BadPracticeCard";
import ExpertCard from "../ExpertCard/ExpertCard";
import FormationCard from "../FormationCard/FormationCard";
import EmptyCard from "../EmptyCard/EmptyCard";
import { useState } from "react";


function CardsHistory({ cards }) {
    const [startIndex, setStartIndex] = useState(0);
    const cardsPerPage = 5;

    const handleNextPage = () => {
        if (startIndex + cardsPerPage < cardsTest.length) {
            setStartIndex(startIndex + cardsPerPage);
        }
    };

    const handlePrevPage = () => {
        if (startIndex - cardsPerPage >= 0) {
            setStartIndex(startIndex - cardsPerPage);
        }
    };

    let cardsTest: Card[] = [
        {
            cardType: 'BestPractice',
            id: '1',
            title: 'coucou',
            contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ante vel nunc gravida lacinia',
            carbon_loss: 200,
            network_gain: true,
            memory_gain: true,
            cpu_gain: true,
            storage_gain: true,
            difficulty: Difficulty.ONE,
            actor: 'ProductOwner',
        },
        // Repeat the same card 20 times
        ...Array(8).fill({
            cardType: 'BestPractice',
            id: '1',
            title: 'Best Practice',
            contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ante vel nunc gravida lacinia',
            carbon_loss: 100,
            network_gain: true,
            memory_gain: true,
            cpu_gain: true,
            storage_gain: true,
            difficulty: Difficulty.ONE,
            actor: 'ProductOwner',
        }),
    ];


    const cardsDisplayed = cards.slice(startIndex, startIndex + cardsPerPage);


    return (
        <>
            <div className={styles.opponentHistory}>
                {cardsDisplayed.map((card, index) => (
                     <div key={index} className={`${styles.card}`}>
                     {card.cardType === 'BestPractice' && (
                         <BestPracticeCard
                             cardType={card.cardType}
                             id={card.id}
                             title={card.title}
                             contents={card.contents}
                             carbon_loss={card.carbon_loss} 
                             network_gain={false} 
                             memory_gain={false} 
                             cpu_gain={false} 
                             storage_gain={false} 
                             actor={'ProductOwner'} 
                             difficulty={card.difficulty}
                             />
                     )}
                     {card.cardType === 'BadPractice' && (
                         <BadPracticeCard
                             cardType={card.cardType}
                             id={card.id}
                             title={card.title}
                             contents={card.contents}
                             targetedPlayerId={card.targetedPlayerId} network_gain={false} memory_gain={false} cpu_gain={false} storage_gain={false} difficulty={"c:/Users/grego/Documents/GitHub/smartcgi/workspaces/shared/common/Cards".ONE} carbon_loss={0} actor={"ProductOwner"}                                />
                     )}
                     {card.cardType === 'Expert' && (
                         <ExpertCard
                             cardType={card.cardType}
                             id={card.id}
                             actor={card.actor}
                             title={card.title}
                             contents={card.contents} carbon_loss={0}                                
                             />
                     )}
                     {card.cardType === 'Formation' && (
                         <FormationCard
                             cardType={card.cardType}
                             id={card.id}
                             actor={card.actor}
                             title={card.title}
                             contents={card.contents} linkToFormation={''} carbon_loss={0} />
                     )}
                     {card.cardType !== 'BestPractice' && card.cardType !== 'BadPractice' && card.cardType !== 'Expert' && card.cardType !== 'Formation' && (
                         <EmptyCard/>
                     )}
                 </div>
                ))}
            </div>
            <div className={styles.pagination}>
                <button onClick={handlePrevPage} disabled={startIndex === 0}>←</button>
                <button onClick={handleNextPage} disabled={startIndex + cardsPerPage >= cards.length}>→</button>
            </div>
        </>
    );
}

export default CardsHistory;
