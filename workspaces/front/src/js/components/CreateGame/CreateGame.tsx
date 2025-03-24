import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateGame.module.css';
import arrowBack from '@app/assets/icons/arrowBack.png';
import Lobby from '../../pages/lobby/lobby';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';

const CreateGame: React.FC = () => {
    const [co2Value, setCo2Value] = React.useState("");
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
        setCo2Value(event.target.value);
    };

    const handlePseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPseudo(event.target.value);
    };

    const handleCreateGame = () => {
        if (co2Value === "" || Number(co2Value) < 500 || Number(co2Value) > 1000) {
            setErrorMessage("Veuillez entrer une valeur entre 500 et 1000");
        } else {
            setErrorMessage("");
        }

        if (pseudo === "") {
            setPseudoErrorMessage("Veuillez entrer un pseudo");
        } else {
            setPseudoErrorMessage("");
            if (co2Value !== "" && Number(co2Value) >= 500 && Number(co2Value) <= 1000) {
                setErrorMessage("");
                setCreateGameMessage(`Partie créée avec ${co2Value}kg de CO2 à économiser et le pseudo ${pseudo}`);

                sm.emit({
                    event: ClientEvents.LobbyCreate,
                    data: {
                        co2Quantity: Number(co2Value),
                        playerName: pseudo,
                        ownerToken: localStorage.getItem('token') || '' // TODO: throw error if no token instead
                    }
                });
            } else {
                setErrorMessage("Veuillez entrer une valeur entre 500 et 1000");
            }
        }
    };

    return (
        <div className={styles.createGameContainer}>

            <div className={styles.containerHeader}>
                <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/menu')}>
                    <img src={arrowBack} />
                    <span>Retour</span>
                </div>
                <h2>Créer une partie</h2>
            </div>

            <div className={styles.co2ScaleContainer}>
                <p>Quantité de CO₂ à économiser : <span>{co2Value || '?'}</span> kg</p>

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
                    placeholder='Pseudo'
                    onChange={handlePseudoChange}
                />

                {pseudoErrorMessage && <p className={styles.error}>{pseudoErrorMessage}</p>}
            </div>

            <button className={styles.button} onClick={handleCreateGame}>Créer la partie</button>

            {createGameMessage && <p className={styles.message}>{createGameMessage}</p>}
        </div>
    );
};

export default CreateGame;
