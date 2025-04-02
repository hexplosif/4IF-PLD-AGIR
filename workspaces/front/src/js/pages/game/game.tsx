import { useEffect, useMemo } from 'react';

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

function GamePage() {

  const [gameState] = useRecoilState(GameState);
  const [sensibilisationQuestion] = useRecoilState(SensibilisationQuestionState);
  const [practiceQuestion] = useRecoilState(PracticeQuestionState);
  const [askDrawMode] = useRecoilState(AskDrawModeState);
  const [playCardState, setPlayCardState] = useRecoilState( PlayCardState );
  const { sm } = useGameManager();

  const thisPlayerId = useMemo(() => localStorage.getItem('clientInGameId'), []);
  const playerStatesById = useMemo(() => {
      const res : Record<string, PlayerStateInterface> = {}
      gameState.playerStates.map(p => {
        res[p.clientInGameId] = p;
      })
      return res;
  }, [gameState]);

  const playersPosition = useMemo(() => {
    const players = gameState.playerStates.map(p => p.clientInGameId);
    const thisPlayerIndex = players.indexOf(thisPlayerId);

    if (players.length == 4)
      return {
        [players[(thisPlayerIndex + 1) % players.length]] : 'left',
        [players[(thisPlayerIndex + 2) % players.length]] : 'top',
        [players[(thisPlayerIndex + 3) % players.length]] : 'right',
      }
    else if (players.length == 3)
      return {
        [players[(thisPlayerIndex + 1) % players.length]] : 'left',
        [players[(thisPlayerIndex + 2) % players.length]] : 'right',
      }
    else if (players.length == 2)
      return {
        [players[(thisPlayerIndex + 1) % players.length]] : 'top',
      }
  }, [gameState]);

  const otherPlayersNotBlocked = useMemo(() => {
    return gameState.playerStates
              .filter((playerState) => !playerState.badPractice && playerState.clientInGameId !== thisPlayerId)
              .map((playerState) => playerState.clientInGameId);
  }, [gameState.playerStates]);

  const [isShowQuizz, { open: openQuizz, close: closeQuizz }] = useDisclosure(false); // for show quizz
  const [isShowTurnInfo, { open: openTurnInfo, close: closeTurnInfo }] = useDisclosure(false); // for show turn info

  const QuizzModal = () => {
    let modalContent = null;
    if (sensibilisationQuestion) { modalContent = <SensibilisationQuiz/>; }
    else if (practiceQuestion) { modalContent = <PracticeQuestion card={practiceQuestion.card} />; }
    else if (askDrawMode) { modalContent = <DrawModeQuestion playerSensibilisationPoints={ playerStatesById[thisPlayerId].sensibilisationPoints }/>; }

    return (
      <Modal opened={modalContent !== null} onClose={() => {}} centered withCloseButton={false} size={"xl"}>
        {modalContent}
      </Modal>
    )
  }

  useEffect(() => {
    console.log("GameState" ,gameState);
    if (sensibilisationQuestion || practiceQuestion) { openQuizz(); }
    else { closeQuizz(); }
  }, [gameState]);

  const TurnInfoModal = () => {
    if (!gameState.currentPlayerId) { return; }
    const player = gameState.currentPlayerId === localStorage.getItem('clientInGameId') 
                    ? 'Your' 
                    : gameState.playerStates.find((playerState) => playerState.clientInGameId === gameState.currentPlayerId)?.playerName + "'s";
    return (<Modal opened={isShowTurnInfo} onClose={() => {}} withCloseButton={false} size="auto" centered>
      <p className={styles.turnInfo}>It's <span className={styles.turnInfoName}>{player} </span> turn</p>
    </Modal>)
  }

  useEffect(() => {

    if (!gameState.currentPlayerId) return;
    openTurnInfo();
    setTimeout(() => { closeTurnInfo(); }, 2000);
  }, [gameState.currentPlayerId]);

  useEffect(() => {
    if (playCardState) {
      setPlayCardState(null);
      sm.emit({ event: ClientEvents.AcknowledgeAnimation, });
    }
  }, [playCardState]);

  const handlePlayCard = (card: Card, targetPlayerId?: string) => {
    console.log("handlePlayCard. card =", card);
    console.log("handlePlayCard. targetPlayerId =", targetPlayerId);
    sm.emit({ 
      event: ClientEvents.PlayCard, 
      data: { card, targetPlayerId } 
    });
  }

  const handleDiscardCard = (card: Card) => {
    sm.emit({ event: ClientEvents.DiscardCard, data: { card } });
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
          const playerState = playerStatesById[playerId];
          const position = playersPosition[playerId];
          return (
            <div key={playerId} className={`${styles.opponentBoard} ${styles[position]}`}>
              <OpponentStatus
                playerState={playerState}
                position={position as "left" | "top" | "right"}
                isTurnPlayer={gameState.currentPlayerId === playerId}
                onDropBadPracticeCard={(card: Card) => handlePlayCard(card, playerId)}
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
      />
    </div>
  );

}

export default GamePage;
