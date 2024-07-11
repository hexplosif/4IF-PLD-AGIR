import React, { useEffect, useState } from 'react';
import Header from "@app/js/components/header/Header";
import EndGameSummary from '@app/js/components/EndGameSummary/EndGameSummary';
import MyEndGameSummary from '@app/js/components/MyEndGameSummary/MyEndGameSummary';
import { useRecoilState } from 'recoil';
import { CurrentGameReport } from '@app/js/components/Game/states';
import styles from './summary.module.css';
import { Card } from '@shared/common/Cards';


function SummaryPage() {
    const [gameReport] = useRecoilState(CurrentGameReport);

    return (
        <>
            <Header />
            <label className={styles.label}>Vainqueur</label>
            <label className={styles.label1}>{gameReport?.winnerName}</label>

            {gameReport ? (
                <div className={styles.container}>
                    <EndGameSummary cards={gameReport.mostPopularCards} />
                    <MyEndGameSummary cards={gameReport.myArchivedCards} />
                    <button className={styles.buttonMenu} onClick={() => window.location.href = "/menu"}>Retour au menu</button>
                </div>
            ) : (
                <></>
            )}
        </>
    )
}

export default SummaryPage;
