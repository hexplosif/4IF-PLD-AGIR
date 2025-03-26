import React from 'react';
import { useRecoilState } from 'recoil';
import Header from "@app/js/components/header/Header";
import EndGameSummary from '@app/js/components/EndGameSummary/EndGameSummary';
import MyEndGameSummary from '@app/js/components/MyEndGameSummary/MyEndGameSummary';
import { GameReportState } from "@app/js/states/gameStates";
import styles from './summary.module.css';
import { useGameManager } from '@app/js/hooks';
import BackgroundImg from '@app/js/components/BackgroundImage/BackgroundImg';
import { GoTrophy } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";

function SummaryPage() {
    useGameManager();
    const [gameReport] = useRecoilState(GameReportState);

    const handleBackToMenu = () => {
        window.location.href = "/menu";
    };

    return (
        <div className={styles.pageContainer}>
            <BackgroundImg />
            <Header />
            
            {gameReport ? (
                <div className={styles.floatingContainer}>
                    <div className={styles.winnerBanner}>
                        <GoTrophy className={styles.trophyIcon} size={48} />
                        <h1 className={styles.winnerTitle}>Vainqueur</h1>
                        <p className={styles.winnerName}>{gameReport.winnerName}</p>
                    </div>

                    <div className={styles.summaryContent}>
                        <div className={styles.summarySection}>
                            <EndGameSummary cards={gameReport.mostPopularCards} />
                        </div>
                        <div className={styles.summarySection}>
                            <MyEndGameSummary cards={gameReport.myArchivedCards} />
                        </div>
                    </div>

                    <button 
                        className={`button-reset ${styles.backButton} `} 
                        onClick={handleBackToMenu}
                    >
                        <MdKeyboardArrowLeft size={24} />
                        Retour au menu
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default SummaryPage;