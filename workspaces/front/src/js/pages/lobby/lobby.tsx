import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import Header from "@app/js/components/header/Header";
import { useGameManager } from '@app/js/hooks';
import { LobbyState } from "@app/js/states/gameStates";
import { ClientEvents } from '@shared/client/ClientEvents';

import styles from './lobby.module.css';
import { FaRegUser } from "react-icons/fa6";

function PageLobby(){
    const {sm} = useGameManager();

    const [isCopied, setIsCopied] = useState(false);
    const [lobbyState, _] = useRecoilState(LobbyState);
    const isOwner = lobbyState?.ownerId === localStorage.getItem('ownerId');

    const handleCodeClick = useCallback(() => {
        setIsCopied(true);
        navigator.clipboard.writeText(lobbyState?.connectionCode || '');
        setTimeout(() => setIsCopied(false), 2000); 
    }, [lobbyState]);

    const getNumberOfLobbyPlayers = useCallback(() => {
        return Object.keys(lobbyState?.clientsNames).length || 0;
    }, [lobbyState]);

    const handleStartGame = useCallback(() => {
        console.log('[LobbyComponent] handleStartGame. ClientInGameId:', localStorage.getItem('clientInGameId'));
        console.log('[LobbyComponent] handleStartGame. OwnerId:', lobbyState?.ownerId);
        if (getNumberOfLobbyPlayers() >= 2){
            sm.emit({
                event: ClientEvents.LobbyStartGame,
                data: {
                //clientInGameId: localStorage.getItem('clientInGameId') ?? ''
                    clientInGameId: lobbyState?.ownerId ?? ''
                }
            })
        } else {
            alert("Il n'y a pas assez de joueurs pour lancer la partie")
        }
    }, [lobbyState, getNumberOfLobbyPlayers]);

    const getParticipants = useCallback(() => {
        const participants = [];
        const clientsNames = lobbyState?.clientsNames || {};
        const ownerId = lobbyState?.ownerId;
        
        // Ajouter l'hôte en premier
        if (ownerId && clientsNames[ownerId]) {
          participants.push({
            id: ownerId,
            name: clientsNames[ownerId],
            isHost: true
          });
        }
        
        // Ajouter les autres participants
        Object.keys(clientsNames).forEach(id => {
          if (id !== ownerId) {
            participants.push({
              id,
              name: clientsNames[id],
              isHost: false
            });
          }
        });
        
        // Compléter avec des participants manquants
        while (participants.length < 4) {
          participants.push({
            id: `empty-${participants.length}`,
            name: "En attente d'une personne",
            empty: true
          });
        }
        
        return participants;
    }, [lobbyState]);

    useEffect(() => {
        console.log('[LobbyComponent] lobbyState.clientsNames:', lobbyState.clientsNames);
    }, [lobbyState.clientsNames]);

    return (
        <div className={styles.container}>
            <Header />

            <div className={`floating-container`}>

                <h2 className={styles.title}>Lobby</h2>
        
                <div className={styles.codeContainer}>
                    <button  className={`${styles.codeButton} ${isCopied ? styles.copied : ''} button-reset`} onClick={handleCodeClick}>
                        {isCopied ? 'Code copié!' : `Code: ${lobbyState?.connectionCode || ''}`}
                    </button>
                </div>
        
                <div className={styles.participantsContainer}>
                    {getParticipants().map((participant, ind) => 
                        <div key={ind} 
                            className={`${styles.listTile} ${participant.empty ? styles.outlineListTile : styles.filledListTile}`}
                        >
                            <FaRegUser />
                            <p className={styles.participantName}>
                                {participant.name}
                                {participant.isHost && <span className={styles.hostTag}>(Hôte)</span>}
                            </p>
                        </div>
                    )}
                </div>
        
                {isOwner && (
                <button className={`${styles.startButton} ${getNumberOfLobbyPlayers() < 2 && styles.disabled} button-reset`} onClick={handleStartGame}>
                    Lancer La Partie
                </button>
                )}
            </div>
        </div>
    )
}

export default PageLobby;