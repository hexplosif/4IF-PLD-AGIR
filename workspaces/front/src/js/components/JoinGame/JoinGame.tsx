import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './JoinGame.module.css';
import { useNavigate } from 'react-router-dom';
import useSocketManager from '@hooks/useSocketManager';
import arrowBack from '@app/assets/icons/arrowBack.png';
import { ClientEvents } from '@shared/client/ClientEvents';

const JoinGame: React.FC = () => {
    const { t } = useTranslation('joinGame');
    const [codePartie, setcodePartie] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [pseudoErrorMessage, setPseudoErrorMessage] = React.useState("");
    const [pseudo, setPseudo] = React.useState("");
    const [createGameMessage, setCreateGameMessage] = React.useState("");
    const navigate = useNavigate();

    const redirectToPage = (path) => {
        navigate(path);
    };

    const { sm } = useSocketManager();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setcodePartie(event.target.value);
    };
    const handlePseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPseudo(event.target.value);
    }

    const handleJoinGame = () => {
        if (codePartie === "" || Number(codePartie) < 1000) {
            setErrorMessage(t('inputs.game-code.error'));
        } else {
            setErrorMessage("");
        }
        if (pseudo === "") {
            setPseudoErrorMessage(t('inputs.pseudo.error'));
        } else {
            setPseudoErrorMessage("");
            if (codePartie !== "" && Number(codePartie) >= 1000) {
                sm.emit({
                    event: ClientEvents.LobbyJoin,
                    data: {
                        playerName: pseudo,
                        connectionCode: codePartie,
                        playerToken: localStorage.getItem('token') || ''
                    }
                })
                setErrorMessage("");
                setCreateGameMessage(
                    t('success-message', { 
                        gameCode: codePartie, 
                        pseudo: pseudo 
                    })
                );
            }
            else {
                setErrorMessage(t('inputs.game-code.error'));
            }
        }
    };

    return (
        <div className={styles.joinGameContainer}>
            <div className={styles.containerHeader}>
                <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/menu')}>
                    <img src={arrowBack} />
                    <span>{t('header.return')}</span>
                </div>
                <h2>{t('header.title')}</h2>
            </div>

            <div className={styles.inputContainer}>
                <input
                    className={errorMessage && styles.errorInput}
                    type="text"
                    placeholder={t('inputs.game-code.placeholder')}
                    value={codePartie}
                    onChange={handleInputChange}
                />

                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            </div>

            <div className={styles.inputContainer}>
                <input
                    className={pseudoErrorMessage && styles.errorInput}
                    type="text"
                    placeholder={t('inputs.pseudo.placeholder')}
                    value={pseudo}
                    onChange={handlePseudoChange}
                />

                {pseudoErrorMessage && <p className={styles.error}>{pseudoErrorMessage}</p>}
            </div>

            <button className={styles.button} onClick={handleJoinGame}>
                {t('button')}
            </button>

            {createGameMessage && <p className={styles.message}>{createGameMessage}</p>}
        </div>
    );
};

export default JoinGame;