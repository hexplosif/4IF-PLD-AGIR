import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateGame.module.css';
import arrowBack from '@app/assets/icons/arrowBack.png';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useTranslation } from 'react-i18next';

const CreateGame: React.FC = () => {
    const { t } = useTranslation('createGame'); // Dùng 'createGame' namespace
    const [co2Value, setCo2Value] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [pseudoErrorMessage, setPseudoErrorMessage] = React.useState("");
    const [pseudo, setPseudo] = React.useState("");
    const [createGameMessage, setCreateGameMessage] = React.useState("");
    const navigate = useNavigate();

    const redirectToPage = (path: string) => {
        navigate(path);
    };

    const { sm } = useSocketManager();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCo2Value(event.target.value);
    };

    const handlePseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPseudo(event.target.value);
    };

    const handleCreateGame = () => {
        if (co2Value === "" || Number(co2Value) < 500 || Number(co2Value) > 1000) {
            setErrorMessage(t("create-game-form.co2-scale-error"));
        } else {
            setErrorMessage("");
        }

        if (pseudo === "") {
            setPseudoErrorMessage(t("create-game-form.pseudo-error"));
        } else {
            setPseudoErrorMessage("");
            if (co2Value !== "" && Number(co2Value) >= 500 && Number(co2Value) <= 1000) {
                setErrorMessage("");
                setCreateGameMessage(t("create-game-form.create-game-message", { co2Value, pseudo }));

                sm.emit({
                    event: ClientEvents.LobbyCreate,
                    data: {
                        co2Quantity: Number(co2Value),
                        playerName: pseudo,
                        ownerToken: localStorage.getItem('token') || '' // TODO: throw error if no token instead
                    }
                });
            } else {
                setErrorMessage(t("create-game-form.co2-scale-error"));
            }
        }
    };

    return (
        <div className={styles.createGameContainer}>

            <div className={styles.containerHeader}>
                <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/menu')}>
                    <img src={arrowBack} />
                    <span>{t("create-game-form.return-button")}</span>
                </div>
                <h2>{t("create-game-form.title")}</h2>
            </div>

            <div className={styles.co2ScaleContainer}>
                <p>{t("create-game-form.co2-scale-label")} <span>{co2Value || t("create-game-form.co2-scale-placeholder")}</span> kg</p>

                <input
                    className={styles.scaler + ' ' + (errorMessage && styles.errorInput)}
                    type="range"
                    min={500}
                    max={1000}
                    step={10}
                    value={co2Value}
                    onChange={handleInputChange}
                />

                {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            </div>

            <div className={styles.inputContainer}>
                <input
                    className={pseudoErrorMessage && styles.errorInput}
                    type="text"
                    value={pseudo}
                    placeholder={t("create-game-form.pseudo-placeholder")}
                    onChange={handlePseudoChange}
                />

                {pseudoErrorMessage && <p className={styles.error}>{pseudoErrorMessage}</p>}
            </div>

            <button className={styles.button} onClick={handleCreateGame}>{t("create-game-form.create-game-button")}</button>

            {createGameMessage && <p className={styles.message}>{createGameMessage}</p>}
        </div>
    );
};

export default CreateGame;
