import { useEffect, useMemo, useState } from 'react';

import styles from './game.module.css';
import { useRecoilState } from 'recoil';
import {
  AskDrawModeState,
  GameState,
  LobbyState,
  PlayCardState,
  PracticeQuestionState,
  SensibilisationQuestionState
} from "@app/js/states/gameStates";
import { ClientEvents } from '@shared/client/ClientEvents';
import { useGameManager } from '@app/js/hooks';
import { Menu, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DrawModeQuestion, PracticeQuestion, SensibilisationQuiz } from '@app/js/components/game/quizz';
import GameHeader from '@app/js/components/game/general/gameHeader/GameHeader';
import PlayerTable from '@app/js/components/game/general/playerTable/playerTable';
import PlayArea from '@app/js/components/game/general/playArea/playArea';
import OpponentStatus from '@app/js/components/game/general/opponentStatus/opponentStatus';
import { CardDeck } from '@app/js/components/game/card';
import { Card } from '@shared/common/Cards';
import { PlayerStateInterface } from '@shared/common/Game';
import { CardAction } from '@shared/server/types';
import { FiChevronDown } from 'react-icons/fi';
import { LANGUAGES_INFO } from '@app/js/constants/lang';
import { Language } from '@shared/common/Languages';
import { useTranslation } from 'react-i18next';

type PlayerPosition = "left" | "top" | "right" | "bottom";

function GamePage() {
  const [gameState] = useRecoilState(GameState);
  const [lobbyState, _] = useRecoilState(LobbyState);
  const gameName = lobbyState?.gameName;
  const [sensibilisationQuestion] = useRecoilState(SensibilisationQuestionState);
  const [practiceQuestion, setPracticeQuestion] = useRecoilState(PracticeQuestionState);
  const [askDrawMode] = useRecoilState(AskDrawModeState);
  const [playCardState] = useRecoilState(PlayCardState);
  const { sm } = useGameManager();

  const [drawCard, setDrawCard] = useState<null | { card: Card, drawPosition: PlayerPosition }>();
  const [playCard, setPlayCard] = useState<null | { card: Card, playerId: string }>();
  const [discardCard, setDiscardCard] = useState<null | { index: number, playerId: string }>();

  const thisPlayerId = useMemo(() => localStorage.getItem('clientInGameId'), []);
  const playerStatesById = useMemo(() => {
    const res: Record<string, PlayerStateInterface> = {}
    gameState.playerStates.map(p => {
      res[p.clientInGameId] = p;
    })
    return res;
  }, [gameState]);

  const playersPosition: Record<string, PlayerPosition> = useMemo(() => {
    const players = gameState.playerStates.map(p => p.clientInGameId);
    const thisPlayerIndex = players.indexOf(thisPlayerId);

    if (players.length == 4) {
      return {
        [players[(thisPlayerIndex + 1) % players.length]]: 'left',
        [players[(thisPlayerIndex + 2) % players.length]]: 'top',
        [players[(thisPlayerIndex + 3) % players.length]]: 'right',
        [thisPlayerId]: 'bottom',
      };
    } else if (players.length == 3) {
      return {
        [players[(thisPlayerIndex + 1) % players.length]]: 'left',
        [players[(thisPlayerIndex + 2) % players.length]]: 'right',
        [thisPlayerId]: 'bottom',
      };
    } else if (players.length == 2) {
      return {
        [players[(thisPlayerIndex + 1) % players.length]]: 'top',
        [thisPlayerId]: 'bottom',
      };
    }
    return {};
  }, [gameState.playerStates]); // Simplifier la dépendance

  const otherPlayersNotBlocked = useMemo(() => {
    return gameState.playerStates
      .filter((playerState) => !playerState.badPractice && playerState.clientInGameId !== thisPlayerId)
      .map((playerState) => playerState.clientInGameId);
  }, [gameState.playerStates]);

  // const [isShowQuizz, { open: openQuizz, close: closeQuizz }] = useDisclosure(false); // for show quizz
  const [isShowTurnInfo, { open: openTurnInfo, close: closeTurnInfo }] = useDisclosure(false); // for show turn info
  const [isShowWaitting, { open: openWaitting, close: closeWaitting }] = useDisclosure(false); // for show turn info

  // Ajout de la gestion des langues
  const { t, i18n } = useTranslation('game');
  const [langue, setLangue] = useState<Language>(i18n.language as Language);

  const changerLangue = (newLangue: Language) => {
    setLangue(newLangue);
    i18n.changeLanguage(newLangue);
  };

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  const QuizzModal = () => {
    let modalContent = null;
    if (sensibilisationQuestion) { modalContent = <SensibilisationQuiz />; }
    else if (practiceQuestion) { modalContent = <PracticeQuestion card={practiceQuestion.card} />; }
    else if (askDrawMode) { modalContent = <DrawModeQuestion playerSensibilisationPoints={playerStatesById[thisPlayerId].sensibilisationPoints} />; }

    return (
      <Modal zIndex={9999} opened={modalContent !== null} onClose={() => { }} centered withCloseButton={false} size="auto"
        classNames={{ body: styles.modalBody }}
      >
        {modalContent}
      </Modal>
    )
  }

  useEffect(() => {
    closeWaitting();
  }, [gameState]);

  useEffect(() => {
    if (sensibilisationQuestion || practiceQuestion || askDrawMode) {
      closeWaitting();
    }
  }, [sensibilisationQuestion, practiceQuestion, askDrawMode]);

  const TurnInfoModal = () => {
    if (!gameState.currentPlayerId) { return; }
    const player = gameState.currentPlayerId === localStorage.getItem('clientInGameId')
      ? t('yourTurn')
      : gameState.playerStates.find((playerState) => playerState.clientInGameId === gameState.currentPlayerId)?.playerName + "'s";
    return (<Modal zIndex={9999} opened={isShowTurnInfo} onClose={() => { }} withCloseButton={false} size="auto" centered>
      <p className={styles.turnInfo}>{t('its')} 
        <span className={styles.turnInfoName}> {player} </span>
        {t('turn')}</p>
    </Modal>)
  }

  useEffect(() => {

    if (!gameState.currentPlayerId) return;
    openTurnInfo();
    setTimeout(() => { closeTurnInfo(); }, 2000);
  }, [gameState.currentPlayerId]);

  useEffect(() => {
    // closeWaitting();
    setDrawCard(playCardState?.action === CardAction.DRAW ? {
      card: playCardState.card,
      drawPosition: playersPosition[playCardState.playerId],
    } : null);

    setPlayCard(playCardState?.action === CardAction.PLAY ? {
      card: playCardState.card,
      playerId: playCardState.playerId,
    } : null);

    setDiscardCard(playCardState?.action === CardAction.DISCARD ? {
      index: Math.floor(Math.random() * 5),
      playerId: playCardState.playerId,
    } : null);

    if (playCardState?.action === CardAction.PLAY && playCardState?.playerId === thisPlayerId) {
      handleOnePlayCard();
    }

    if (playCardState?.action === CardAction.DISCARD && playCardState?.playerId === thisPlayerId) {
      handleAnimationFinish();
    }
  }, [playCardState]);

  useEffect(() => {
    console.log('Client Changed language')
    sm.emit({
      event: ClientEvents.PlayerChangeLanguage,
      data: {
        playerLanguage: i18n.language
      }
    })
  }, [t]);

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

  const handleEndGame = () => {
    if (window.confirm(t('endGameConfirmation'))) {
      sm.emit({
        event: ClientEvents.EndGame,
        data: {}
      });
    }
  }

  useEffect(() => {
    console.log("Hey", playCardState);
  }, [playCardState]);

  return (
    <div className={styles.page}>
      {/* Sélecteur de langue */}
      <div className={styles.langSelectorContainer}>
        <Menu width={200} shadow="md" position="bottom-end"
          classNames={{
            dropdown: `${styles.langDropdown}`,
            item: `${styles.langItem} button-reset`
          }}
        >
          <Menu.Target>
            <button className={`button-reset ${styles.langButton}`}>
              <img className={styles.langButtonIcon} src={LANGUAGES_INFO[langue].img} alt={t('changeLanguage')} />
              <span className={styles.langCode}>{langue.toUpperCase()}</span>
              <FiChevronDown className={styles.arrowIcon} />
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{t('selectLanguage')}</Menu.Label>
            {Object.keys(LANGUAGES_INFO).map((lang) => {
              const langueInfo = LANGUAGES_INFO[lang as Language];
              if (langueInfo) {
                return (
                  <Menu.Item
                    key={langueInfo.code}
                    onClick={() => changerLangue(lang as Language)}
                    leftSection={<img src={langueInfo.img} alt={langueInfo.name} width={20} />}
                  >
                    {langueInfo.name}
                  </Menu.Item>
                );
              }
              return null;
            })}
          </Menu.Dropdown>
        </Menu>
      </div>

      <GameHeader
        playerState={playerStatesById[thisPlayerId]}
        maxScore={gameState.co2Quantity}
        className={styles.gameHeader}
      />

      {QuizzModal()}
      {TurnInfoModal()}

      <PlayArea
        className={styles.playArea}
        width={600}
        height={250}
        onDropCard={(card: Card) => handlePlayCard(card)}
      />

      <PlayerTable
        nbOtherPlayersNotBlocked={otherPlayersNotBlocked.length}
        playerState={playerStatesById[thisPlayerId]}
        isTurnPlayer={gameState.currentPlayerId === thisPlayerId}
        onDiscardCard={handleDiscardCard}
        gameName={gameName}
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

              playCard={playCard?.playerId === playerId ? playCard?.card : null}
              onFinishPlayCard={handleOnePlayCard}

              discardCardIndex={discardCard?.playerId === playerId ? discardCard.index : null}
              onFinishDiscardCard={handleAnimationFinish}
            />
          </div>
        )
      })
      }

      <CardDeck
        flip={false}
        count={5}
        widthCard={150}
        className={styles.cardDeck}
        placeholder={t('deck.title')}
        dataTooltip={t('deck.tooltip')}

        drawCard={drawCard?.card}
        onFinishDrawCard={handleAnimationFinish}
        drawToPosition={drawCard?.drawPosition}
      />

      <button
        className={styles.endGameButton}
        onClick={handleEndGame}
      >
        {t('endGame')}
      </button>

      <Modal zIndex={9999} opened={isShowWaitting} onClose={() => { }} withCloseButton={false} size="auto" centered>
        <p className={styles.turnInfo}>{t('waiting')}</p>
      </Modal>
    </div>
  );

}

export default GamePage;
