import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";
import { GoTrophy } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";

import Header from "@app/js/components/header/Header";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";
import EndGameSummary from '@app/js/components/EndGameSummary/EndGameSummary';
import MyEndGameSummary from '@app/js/components/MyEndGameSummary/MyEndGameSummary';
import arrowBack from '@app/assets/icons/arrowBack.png';
import arrowNext from '@app/assets/icons/arrowNext.png';

import { GameReportState } from "@app/js/states/gameStates";
import { useGameManager } from '@app/js/hooks';

import styles from './summary.module.css';

const SummaryPage: React.FC = () => {
  useGameManager();
  const { t } = useTranslation('summary');
  const [gameReport] = useRecoilState(GameReportState);
  const [page, setPage] = useState(1);

  if (!gameReport) return null;

  const handleBackToMenu = () => {
    window.location.href = '/menu';
  };

  return (
    <div className={styles.pageContainer}>
      <BackgroundImg />
      <Header />

      <div className={styles.floatingContainer}>

        {/* Header + Page Nav */}
        <div className={styles.headerRow}>
          <div className={styles.title}>
            <h1 >{t('game-over')}</h1>
          </div>
          {page === 1 ? (
            <div className={styles.pageNavNext} onClick={() => setPage(2)}>
              <span>{t('next-page')}</span>
              <img src={arrowNext} />
            </div>
          ) : (
            <div className={styles.pageNavPrev} onClick={() => setPage(1)}>
              <img src={arrowBack} />
              <span>{t('previous-page')}</span>
            </div>
          )}
        </div>

        {/* Winner Banner */}
        <div className={styles.winnerRow}> 
          <h1 className={styles.winnerTitle}>
            {gameReport.winnerName} 
          </h1>
          <p className={styles.wonMessage}>
            {t('won-message')}
          </p>
        </div>

        {/* Main Content: One of the two summaries */}
        <div className={styles.contentArea}>
          {page === 1 && (
            <EndGameSummary cards={gameReport.mostPopularCards} />
          )}
          {page === 2 && (
            <MyEndGameSummary cards={gameReport.myArchivedCards} />
          )}
        </div>

        {/* Back to Menu */}
        <button
          className={styles.backButton}
          onClick={handleBackToMenu}
        >
          <span>{t('return-menu')}</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryPage;
