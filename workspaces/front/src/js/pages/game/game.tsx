import { useEffect, useMemo, useState } from 'react';

import styles from './game.module.css';
import { useRecoilState } from 'recoil';
import { SensibilisationQuestionState, PracticeQuestionState, GameState, AskDrawModeState, PlayCardState } from "@app/js/states/gameStates";
import { ClientEvents } from '@shared/client/ClientEvents';
import { useGameManager } from '@app/js/hooks';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PracticeQuestion, SensibilisationQuiz, DrawModeQuestion } from '@app/js/components/game/quizz';
import GameHeader from '@app/js/components/game/general/gameHeader/GameHeader';
import PlayerTable from '@app/js/components/game/general/playerTable/playerTable';
import PlayArea from '@app/js/components/game/general/playArea/playArea';
import OpponentStatus from '@app/js/components/game/general/opponentStatus/opponentStatus';
import { CardDeck } from '@app/js/components/game/card';
import { Card } from '@shared/common/Cards';
import { PlayerStateInterface } from '@shared/common/Game';
import { CardAction } from '@shared/server/types';

type PlayerPosition = "left" | "top" | "right" | "bottom";

function GamePage() {

  const [gameState] = useRecoilState(GameState);
  const [sensibilisationQuestion] = useRecoilState(SensibilisationQuestionState);
  const [practiceQuestion, setPracticeQuestion] = useRecoilState(PracticeQuestionState);
  const [askDrawMode] = useRecoilState(AskDrawModeState);
  const [playCardState] = useRecoilState( PlayCardState );
  const { sm } = useGameManager();

  const [ drawCard, setDrawCard ] = useState<null | {card: Card, drawPosition: PlayerPosition}>();
  const [ playCard, setPlayCard ] = useState<null | {card: Card, playerId: string}>();
  const [ discardCard, setDiscardCard ] = useState<null | {index: number, playerId: string}>();

  const thisPlayerId = useMemo(() => localStorage.getItem('clientInGameId'), []);
  const playerStatesById = useMemo(() => {
      const res : Record<string, PlayerStateInterface> = {}
      gameState.playerStates.map(p => {
        res[p.clientInGameId] = p;
      })
      return res;
  }, [gameState]);

  const playersPosition : Record<string, PlayerPosition> = useMemo(() => {
    const players = gameState.playerStates.map(p => p.clientInGameId);
    const thisPlayerIndex = players.indexOf(thisPlayerId);

    if (players.length == 4)
      return {
        [players[(thisPlayerIndex + 1) % players.length]] : 'left',
        [players[(thisPlayerIndex + 2) % players.length]] : 'top',
        [players[(thisPlayerIndex + 3) % players.length]] : 'right',
        [thisPlayerId] : 'bottom',
      }
    else if (players.length == 3)
      return {
        [players[(thisPlayerIndex + 1) % players.length]] : 'left',
        [players[(thisPlayerIndex + 2) % players.length]] : 'right',
        [thisPlayerId] : 'bottom',
      }
    else if (players.length == 2)
      return {
        [players[(thisPlayerIndex + 1) % players.length]] : 'top',
        [thisPlayerId] : 'bottom',
      }
  }, [gameState]);

  const otherPlayersNotBlocked = useMemo(() => {
    return gameState.playerStates
              .filter((playerState) => !playerState.badPractice && playerState.clientInGameId !== thisPlayerId)
              .map((playerState) => playerState.clientInGameId);
  }, [gameState.playerStates]);

  const [isShowQuizz, { open: openQuizz, close: closeQuizz }] = useDisclosure(false); // for show quizz
  const [isShowTurnInfo, { open: openTurnInfo, close: closeTurnInfo }] = useDisclosure(false); // for show turn info
  const [isShowWaitting, { open: openWaitting, close: closeWaitting }] = useDisclosure(false); // for show turn info

  const QuizzModal = () => {
    let modalContent = null;
    if (sensibilisationQuestion) { modalContent = <SensibilisationQuiz/>; }
    else if (practiceQuestion) { modalContent = <PracticeQuestion card={practiceQuestion.card} />; }
    else if (askDrawMode) { modalContent = <DrawModeQuestion playerSensibilisationPoints={ playerStatesById[thisPlayerId].sensibilisationPoints }/>; }

    return (
      <Modal zIndex={9999} opened={modalContent !== null} onClose={() => {}} centered withCloseButton={false} size={"xl"}
        classNames={{body: styles.modalBody}}
      >
        {modalContent}
      </Modal>
    )
  }

  useEffect(() => {
    console.log("GameState" ,gameState);
    closeWaitting();
    if (sensibilisationQuestion || practiceQuestion) { openQuizz(); }
    else { closeQuizz(); }
  }, [gameState]);

  const TurnInfoModal = () => {
    if (!gameState.currentPlayerId) { return; }
    const player = gameState.currentPlayerId === localStorage.getItem('clientInGameId') 
                    ? 'Your' 
                    : gameState.playerStates.find((playerState) => playerState.clientInGameId === gameState.currentPlayerId)?.playerName + "'s";
    return (<Modal zIndex={9999} opened={isShowTurnInfo} onClose={() => {}} withCloseButton={false} size="auto" centered>
      <p className={styles.turnInfo}>It's <span className={styles.turnInfoName}>{player} </span> turn</p>
    </Modal>)
  }

  useEffect(() => {

    if (!gameState.currentPlayerId) return;
    openTurnInfo();
    setTimeout(() => { closeTurnInfo(); }, 2000);
  }, [gameState.currentPlayerId]);

  useEffect(() => {
    // closeWaitting();
    setDrawCard( playCardState?.action === CardAction.DRAW ? { 
      card: playCardState.card,
      drawPosition: playersPosition[playCardState.playerId],
    } : null);

    setPlayCard( playCardState?.action === CardAction.PLAY ? {
      card: playCardState.card,
      playerId: playCardState.playerId,
    } : null);
    
    setDiscardCard( playCardState?.action === CardAction.DISCARD ? {
      index: Math.floor(Math.random() * 5),
      playerId: playCardState.playerId,
    } : null);

    if (playCardState?.action === CardAction.PLAY  && playCardState?.playerId === thisPlayerId) {
      handleOnePlayCard();
    }

    if (playCardState?.action === CardAction.DISCARD && playCardState?.playerId === thisPlayerId) {
      handleAnimationFinish();
    }
  }, [playCardState]);

  const handlePlayCard = (card: Card, targetPlayerId?: string) => {
    sm.emit({ 
      event: ClientEvents.PlayCard, 
      data: { card, targetPlayerId } 
    });
  }

  const handleDiscardCard = (card: Card) => {
    sm.emit({ event: ClientEvents.DiscardCard, data: { card } });
    openWaitting();
  }

  const handleAnimationFinish = () => {
    sm.emit({ event: ClientEvents.AcknowledgeAnimation, });
    openWaitting();
  }

  const handleOnePlayCard = () => {
    const card = playCardState.card;
    if (['BestPractice', 'BadPractice'].includes(card.cardType)) {
      return setPracticeQuestion({ card });
    }
    handleAnimationFinish();
  }

  return (
    <div className={styles.page}>
      <GameHeader playerState={playerStatesById[thisPlayerId]}
        maxScore={gameState.co2Quantity}
        className={styles.gameHeader}
      />
      {QuizzModal()}
      {TurnInfoModal()}

      <PlayArea 
        className={styles.playArea}
        width={600}
        height={400}
        onDropCard={(card: Card) => handlePlayCard(card)}
      />

      <PlayerTable
        nbOtherPlayersNotBlocked={otherPlayersNotBlocked.length}
        playerState={playerStatesById[thisPlayerId]}
        isTurnPlayer={gameState.currentPlayerId === thisPlayerId}
        onDiscardCard={handleDiscardCard}
      />

      {Object.keys(playersPosition).map(playerId => {
          if (playerId === thisPlayerId) return;
          const playerState = playerStatesById[playerId];
          const position = playersPosition[playerId];
          return (
            <div key={playerId} className={`${styles.opponentBoard} ${styles[position]}`}>
              <OpponentStatus
                playerState={playerState}
                position={position as "left" | "top" | "right"}
                isTurnPlayer={gameState.currentPlayerId === playerId}
                onDropBadPracticeCard={(card: Card) => handlePlayCard(card, playerId)}

                playCard={ playCard?.playerId === playerId ? playCard?.card : null}
                onFinishPlayCard={handleOnePlayCard}

                discardCardIndex={ discardCard?.playerId === playerId ? discardCard.index : null }
                onFinishDiscardCard={handleAnimationFinish}
              />
            </div>
          )
        })
      }

      <CardDeck
        flip={false}
        count={5}
        widthCard={110}
        className={styles.cardDeck}
        placeholder="Card Deck"
        dataTooltip="You will automatically draw a card at the end of your turn."

        drawCard={drawCard?.card}
        onFinishDrawCard={handleAnimationFinish}
        drawToPosition={ drawCard?.drawPosition }
      />

      <Modal zIndex={9999} opened={isShowWaitting} onClose={() => {}} withCloseButton={false} size="auto" centered>
        <p className={styles.turnInfo}>Please waitting!</p>
      </Modal>
    </div>
  );

}

export default GamePage;
