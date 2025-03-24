import React, { useEffect, useState } from "react";
import styles from "./PlayerBoard.module.css";
import PlayerHand from "../PlayerHand/PlayerHand";
import PlayerStatus from "../PlayerStatus/PlayerStatus";
import PlayerInGameHistory from "../PlayerInGameHistory/PlayerInGameHistory";
import { useRecoilState } from "recoil";
import { GameState } from "@app/js/states/gameStates";
import { Bad_Practice_Card } from "@shared/common/Cards";
import { PlayerStateInterface } from "@shared/common/Game";
import CardsHistory from "../CardsHistory/CardsHistory";
import lockerIcon from "@app/assets/icons/locked.webp";

function PlayerBoard({
  MPSelected,
  noMPSelected,
  playerState,
  myTurn,
}: {
  MPSelected: (card: Bad_Practice_Card) => void;
  noMPSelected: () => void;
  playerState: PlayerStateInterface;
  myTurn: boolean;
}) {
  const [gameState] = useRecoilState(GameState);
  const [historyDisplay, setHistoryDisplay] = useState(false);

  useEffect(() => {});

  const handleHistoryClick = () => {
    setHistoryDisplay(true);
  };

  return (
    <div className={styles.board}>
      {playerState && (
        <>
          {playerState.canPlay === false && (
            <img
              className={styles.lockerIcon}
              src={lockerIcon}
              alt="locker icon"
            />
          )}
          {myTurn ? (
            <div className={styles.namePlayerMyTurn}>
              {playerState.playerName}
            </div>
          ) : (
            <div className={styles.namePlayer}>{playerState.playerName}</div>
          )}
          <div className={styles.status}>
            <PlayerStatus playerstate={playerState} me={1} />
          </div>
          <div className={`${styles.hand} ${myTurn ? styles.handMyTurn : ""}`}>
            <PlayerHand
              MPSelected={MPSelected}
              noMPSelected={noMPSelected}
              playerState={playerState}
              myTurn={myTurn}
            />
          </div>
          <div className={styles.history} onClick={() => handleHistoryClick()}>
            <PlayerInGameHistory Cards={playerState.cardsHistory} />
          </div>
        </>
      )}
      {historyDisplay && (
        <>
          <div className={styles.fond}></div>
          <CardsHistory cards={playerState.cardsHistory} />
          <div
            className={styles.closeButton}
            onClick={() => setHistoryDisplay(false)}
          >
            X
          </div>
        </>
      )}
    </div>
  );
}

export default PlayerBoard;
