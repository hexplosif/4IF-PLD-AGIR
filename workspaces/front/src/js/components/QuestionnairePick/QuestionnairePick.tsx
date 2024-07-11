import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionnairePick.module.css';
import { DrawMode } from '@shared/server/types';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useRecoilState } from 'recoil';
import { CurrentUseSensibilisationPoints } from '../Game/states';

const QuestionnairePick = () => {
    const [createMessage, setCreateMessage] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const [answered, setAnswered] = useState(false);
    const navigate = useNavigate();
    const { sm } = useSocketManager();
    const [useSensibilisationPoints, setUseSensibilisationPoints] = useRecoilState(CurrentUseSensibilisationPoints);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!answered) {
                handleAnswer('random');
            }
        }, 15000);

        return () => clearTimeout(timeout);
    }, [answered]);

    const answer = (event) => {
        if (!answered) {
            setAnswered(true);
            const selectedOption = event.currentTarget.textContent;
            setCreateMessage(`Vous avez répondu ${selectedOption}`);
            setTimeout(() => {
                setIsVisible(false);
            }, 2000);
        }
    }

    if (!isVisible) {
        return null;
    }

    const handleAnswer = (drawMode: DrawMode) => {
        
        sm.emit({
            event: ClientEvents.DrawModeChoice,
            data: {
                drawMode: drawMode
            }
        });
        setUseSensibilisationPoints(null);
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>
                Voulez-vous influencer votre pioche en utilisant vos points de sensibilisation ?
            </label> <br />
            <div className={styles.buttonContainer}>
                <button className={answered ? styles.buttonDisabled : styles.button} onClick={() => handleAnswer('random')} disabled={answered}>Random</button>
                {useSensibilisationPoints?.formationCardLeft && useSensibilisationPoints.sensibilisationPoints >= 1 && <button className={answered ? styles.buttonDisabled : styles.button} onClick={() => handleAnswer('randomFormation')} disabled={answered} title="Piocher une carte formation aléatoirement">1 point</button>}
                {useSensibilisationPoints?.formationCardLeft && useSensibilisationPoints.isBlocked && useSensibilisationPoints.sensibilisationPoints >= 3 && <button className={answered ? styles.buttonDisabled : styles.button} onClick={() => handleAnswer('goodFormation')} disabled={answered} title="Piocher la carte formation pour vous débloquer">3 points</button>}
                {useSensibilisationPoints?.expertCardLeft && useSensibilisationPoints.sensibilisationPoints >= 5 && <button className={answered ? styles.buttonDisabled : styles.button} onClick={() => handleAnswer('expert')} disabled={answered} title="Piocher une carte experte aléatoirement">5 points</button>}
            </div>
            {createMessage && <p className={styles.message}>{createMessage}</p>}
        </div>
    );
};

export default QuestionnairePick;
