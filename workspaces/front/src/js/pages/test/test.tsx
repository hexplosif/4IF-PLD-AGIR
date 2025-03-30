import BackCard from '@app/components/card/backCard/backCard';
import BaseCard from '@app/components/card/baseCard/BaseCard';
import FlipCard from '@app/components/card/flipCard/flipCard';
import GameCard from '@app/components/card/gameCard/GameCard';
import { Actor, Card } from '@shared/common/Cards';
import React from 'react';

const testCard : Card = {
  id: '1',
  actor: Actor.DEVELOPER,
  title: 'Test Card',
  contents: 'This is a test card.',
  cardType: 'BadPractice',

  network_gain: true,
  memory_gain: true,
  cpu_gain: false,
  storage_gain: true,

  difficulty: 1,
}

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
      <div
        style={{
          width: '150px',
          height: '600px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
          margin: '0 auto',
        }}
      >
        <FlipCard
          card={testCard}
        />
      </div>
    </div>

  );
};

export default TestPage;