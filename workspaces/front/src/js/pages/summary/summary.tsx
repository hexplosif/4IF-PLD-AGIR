import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";
import { GoTrophy } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";

import Header from "@app/js/components/header/Header";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";
import EndGameSummary from '@app/js/components/EndGameSummary/EndGameSummary';
import MyEndGameSummary from '@app/js/components/MyEndGameSummary/MyEndGameSummary';

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
          <h1 className={styles.title}>{t('winner')}</h1>
          {page === 1 ? (
            <div className={styles.pageNav} onClick={() => setPage(2)}>
              <span>{t('next-page')}</span>
              <MdKeyboardArrowLeft size={20} style={{ transform: 'rotate(180deg)' }} />
            </div>
          ) : (
            <div className={styles.pageNav} onClick={() => setPage(1)}>
              <MdKeyboardArrowLeft size={20} />
              <span>{t('previous-page')}</span>
            </div>
          )}
        </div>

        {/* Winner Banner */}
        <div className={styles.winnerRow}>
          <GoTrophy className={styles.trophyIcon} size={48} />
          <p className={styles.winnerName}>
            {gameReport.winnerName} {t('won-message')}
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
          className={`button-reset ${styles.backButton}`}
          onClick={handleBackToMenu}
        >
          <MdKeyboardArrowLeft size={24} />
          <span>{t('return-menu')}</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryPage;
