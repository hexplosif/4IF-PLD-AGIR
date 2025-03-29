import React, { useEffect, useMemo, useState } from 'react';
import Header from "@app/js/components/header/Header";
import PlayerBoard from '@app/js/components/PlayerBoard/PlayerBoard';

import styles from './game.module.css';
import OpponentBoard from '@app/js/components/OpponentBoard/OpponentBoard';
import CardDeck from '@app/js/components/CardDeck/CardDeck';
import { useRecoilState } from 'recoil';
import { SensibilisationQuestionState, PracticeQuestionState, GameState, AskDrawModeState } from "@app/js/states/gameStates";
import { ClientEvents } from '@shared/client/ClientEvents';
import { PlayerStateInterface } from '@shared/common/Game';
import { Bad_Practice_Card } from '@shared/common/Cards';
import { useGameManager } from '@app/js/hooks';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PracticeQuestion, SensibilisationQuiz, DrawModeQuestion } from '@app/js/components/game/quizz';

function GamePage() {

  const [gameState] = useRecoilState(GameState);
  const [sensibilisationQuestion] = useRecoilState(SensibilisationQuestionState);
  const [practiceQuestion] = useRecoilState(PracticeQuestionState);
  const [askDrawMode] = useRecoilState(AskDrawModeState);
  const { sm } = useGameManager();

  const [isShowQuizz, { open: openQuizz, close: closeQuizz }] = useDisclosure(false); // for show quizz
  const [isShowTurnInfo, { open: openTurnInfo, close: closeTurnInfo }] = useDisclosure(false); // for show turn info

  const currentPlayerState = useMemo(() => {
    return gameState?.playerStates.find((playerState) => playerState.clientInGameId === localStorage.getItem('clientInGameId'));
  }, [gameState]);

  const [MP, setMP] = useState<Bad_Practice_Card | null>(null);

  const handleMPSelected = (card: Bad_Practice_Card) => {
    setMP(card);
    console.log("MPSelected : ", MP);
  };

  const handleNoMPSelected = () => {
    setMP(null);
    console.log("noMPSelected");
  }

  const handleMPPersonSelected = (playerState: PlayerStateInterface) => {
    if (MP !== null) {

      if (playerState.badPractice === null && !(playerState.expertCards.includes(MP.actor))) {
        console.log("La mauvaise pratique est", MP);
        sm.emit({
          event: ClientEvents.PlayCard,
          data: {
            card: {
              ...MP,
              targetedPlayerId: playerState.clientInGameId,
            }
          }
        })
        setMP(null);
      } else {
        window.alert(`MPSelected for ${playerState.playerName} but already has a bad practice`);

      }
    }
  }

  let pos = 0;

  const QuizzModal = () => {
    let modalContent = null;
    if (sensibilisationQuestion) { modalContent = <SensibilisationQuiz/>; }
    else if (practiceQuestion) { modalContent = <PracticeQuestion card={practiceQuestion.cardAction} />; }
    else if (askDrawMode) { modalContent = <DrawModeQuestion/>; }

    return (
      <Modal opened={modalContent !== null} onClose={() => {}} centered withCloseButton={false} size={"xl"}>
        {modalContent}
      </Modal>
    )
  }

  useEffect(() => {
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

  return (
    <div className={styles.page}>
      <Header />
      {QuizzModal()}
      {TurnInfoModal()}

      <div className={styles.container}>
        {gameState ? (
          gameState.playerStates.map((playerState, index) => {
            if (playerState.clientInGameId === localStorage.getItem('clientInGameId')) {
              return (
                <>
                  <div className={styles.playerBoard} key={index}>
                    <PlayerBoard MPSelected={handleMPSelected} noMPSelected={handleNoMPSelected} playerState={playerState} myTurn={gameState.currentPlayerId === playerState.clientInGameId} />
                  </div>

                </>

              );
            }
            return null;
          })
        ) : (
          <></>
        )}

        {gameState && gameState.playerStates.map((playerState, index) => {
          if (playerState.clientInGameId !== localStorage.getItem('clientInGameId')) {
            let positionClass = '';
            if (pos === 0) {
              positionClass = styles.opponentBoardRight;
            } else if (pos === 1) {
              positionClass = styles.opponentBoardLeft;
            } else if (pos === 2) {
              positionClass = styles.opponentBoardTop;
            }
            pos = (pos + 1) % 3;
            return (
              <div key={index} className={`${positionClass} ${MP !== null ? ((playerState.badPractice === null &&!(playerState.expertCards.includes(MP.actor) ))? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : positionClass}`}>
                <div onClick={() => handleMPPersonSelected(playerState)}>
                  <OpponentBoard playerState={playerState} myTurn={gameState.currentPlayerId === playerState.clientInGameId} />
                </div>
              </div>
            );
          }
          return null;
        })}

        <div className={styles.deck}>
          <CardDeck />
        </div>
      </div>
    </div>
  );

}

export default GamePage;
