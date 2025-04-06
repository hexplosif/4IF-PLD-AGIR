import BackCard from '@app/components/card/backCard/backCard';
import BaseCard from '@app/components/card/baseCard/BaseCard';
import FlipCard from '@app/components/card/flipCard/flipCard';
import GameCard from '@app/components/card/gameCard/GameCard';
import { CardDeck, DiscardArea } from '@app/js/components/game/card';
import PlayerHand from '@app/js/components/game/card/playerHand/playerHand';
import GameHeader from '@app/js/components/game/general/gameHeader/GameHeader';
import OpponentStatus from '@app/js/components/game/general/opponentStatus/opponentStatus';
import { Actor, Card } from '@shared/common/Cards';
import React from 'react';
import styles from './test.module.css';
import CardList from '@app/js/components/game/atom/cardList/cardList';

const testCard : Card = {
  id: '1',
  actor: Actor.DEVELOPER,
  title: 'Le saviez-vous ?',
  contents: 'Lorem ipsum  dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse  lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. elementum ultrices diam. Maecenas ligula massa, varius a, semper.',
  cardType: 'BadPractice',

  network_gain: true,
  memory_gain: true,
  cpu_gain: false,
  storage_gain: true,

  difficulty: 1,
}

const listCard = Array.from({ length: 8 }, (_, index) => {
  const newCard = { ...testCard };
  newCard.title = `Card ${index + 1}`;
  return newCard;
});

const opponents = [
  {
    id: 1,
    name: "Alice",
    score: 523,
    tokens: 2,
    immuneTypes: { A: true, B: false, C: false },
    isTurn: false,
    position: "left" as const
  },
  {
    id: 2,
    name: "Bob",
    score: 678,
    tokens: 3,
    immuneTypes: { A: false, B: true, C: true },
    isTurn: true,
    position: "top" as const
  },
  {
    id: 3,
    name: "Charlie",
    score: 412,
    tokens: 1,
    immuneTypes: { A: false, B: false, C: false },
    isTurn: false,
    position: "right" as const
  }
];

const cardsInHand = Array.from({ length: 7 }, (_, index) => ({
  card: testCard,
  canPlay: index % 3 === 0, // Just an example condition
}));

const TestPage: React.FC = () => {

  return (
    <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto',
    }}
    >
      {/* <GameHeader/> */}
      <div
        style={{
          width: '1000px',
          height: '600px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <CardList 
          cardElements={Array.from({ length: 7 }, (_, index) => {
            if (index < 6) 
              return  <BackCard key={index} width={80}/>
            return <FlipCard key={index} width={80} card={testCard} />
          })}
          cardWidth={80}
          isCurve={true}
          className={styles.cardsInHandContainer}
          direction={'right'}

          playCard={testCard}
        />
      </div>
    </div>

  );
};

export default TestPage;