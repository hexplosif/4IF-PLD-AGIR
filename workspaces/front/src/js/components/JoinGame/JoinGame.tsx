import React from 'react';
import styles from './JoinGame.module.css';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';

const JoinGame: React.FC = () => {
    const [codePartie, setcodePartie] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [pseudoErrorMessage, setPseudoErrorMessage] = React.useState("");
    const [pseudo, setPseudo] = React.useState("");
    const [createGameMessage, setCreateGameMessage] = React.useState("");

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
                        playerToken : localStorage.getItem('token') || ''
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
        <>
            <div className={styles.codeContainer}>
                <label className={styles.titre}>Rejoindre une partie</label>
            </div>
            <div className={styles.container}>
                <label className={styles.label}>Entrez le code de la partie</label> <br />
                <input className={styles.inputCode} type="text" value={codePartie} onChange={handleInputChange} /> <br />
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                <label className={styles.label}>Rejoindre avec le pseudo : </label> <br />
                <input className={styles.input} type="text" value={pseudo} onChange={handlePseudoChange} /> <br />
                {pseudoErrorMessage && <p className={styles.error}>{pseudoErrorMessage}</p>}
                <button className={styles.button} onClick={handleJoinGame}>Rejoindre</button> <br />
                {createGameMessage && <p className={styles.message}>{createGameMessage}</p>}
            </div>
        </>
    );
};

export default JoinGame;
