import React from 'react';
import styles from './JoinGame.module.css';
import { useNavigate } from 'react-router-dom';
import useSocketManager from '@hooks/useSocketManager';
import arrowBack from '../../../icons/arrowBack.png';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';

const JoinGame: React.FC = () => {
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
            setErrorMessage("Code incorrect");
        } else {
            setErrorMessage("");
        }
        if (pseudo === "") {
            setPseudoErrorMessage("Veuillez entrer un pseudo");
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
                setCreateGameMessage(`Vous avez rejoint la partie ${codePartie} avec le pseudo ${pseudo}`);
            }
            else {
                setErrorMessage("Code incorrect");
            }
        }


    };

    return (
        <div className={styles.joinGameContainer}>

            <div className={styles.containerHeader}>
                <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/menu')}>
                    <img src={arrowBack} />
                    <span>Retour</span>
                </div>
                <h2>Rejoindre une partie</h2>
            </div>

            <div className={styles.inputContainer}>
                <input
                    className={errorMessage && styles.errorInput}
                    type="text"
                    placeholder='Code de la partie'
                    value={codePartie}
                    onChange={handleInputChange}
                />

                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            </div>

            <div className={styles.inputContainer}>
                <input
                    className={pseudoErrorMessage && styles.errorInput}
                    type="text"
                    placeholder='Pseudo'
                    value={pseudo}
                    onChange={handlePseudoChange}
                />

                {pseudoErrorMessage && <p className={styles.error}>{pseudoErrorMessage}</p>}
            </div>

            <button className={styles.button} onClick={handleJoinGame}>Rejoindre la partie</button>

            {createGameMessage && <p className={styles.message}>{createGameMessage}</p>}

        </div>
    );
};

export default JoinGame;
