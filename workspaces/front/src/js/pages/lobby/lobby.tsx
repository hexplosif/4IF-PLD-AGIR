import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';

import Header from "@app/js/components/header/Header";
import { useGameManager } from '@app/js/hooks';
import { LobbyState } from "@app/js/states/gameStates";
import { ClientEvents } from '@shared/client/ClientEvents';

import styles from './lobby.module.css';
import { FaRegUser } from "react-icons/fa6";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";

function PageLobby(){
    const { t } = useTranslation('lobby');
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
                    clientInGameId: lobbyState?.ownerId ?? ''
                }
            })
        } else {
            alert(t('start_game.not_enough_players'))
        }
    }, [lobbyState, getNumberOfLobbyPlayers, t]);

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
            name: t('participants.waiting'),
            empty: true
          });
        }
        
        return participants;
    }, [lobbyState, t]);

    useEffect(() => {
        console.log('[LobbyComponent] lobbyState.clientsNames:', lobbyState.clientsNames);
    }, [lobbyState.clientsNames]);

    return (
        <div className={styles.container}>
            <Header />

            <div className={`floating-container`}>

                <h2 className={styles.title}>{t('title')}</h2>
        
                <div className={styles.codeContainer}>
                    <button 
                        className={`${styles.codeButton} ${isCopied ? styles.copied : ''} button-reset`} 
                        onClick={handleCodeClick}
                    >
                        {isCopied 
                            ? t('code_button.copied') 
                            : t('code_button.default', { code: lobbyState?.connectionCode || '' })
                        }
                    </button>
                </div>
        
                <div className={styles.participantsContainer}>
                    {getParticipants().map((participant, ind) => 
                        <div 
                            key={ind} 
                            className={`${styles.listTile} ${participant.empty ? styles.outlineListTile : styles.filledListTile}`}
                        >
                            <FaRegUser />
                            <p className={styles.participantName}>
                                {participant.name}
                                {participant.isHost && <span className={styles.hostTag}>{t('participants.host_tag')}</span>}
                            </p>
                        </div>
                    )}
                </div>
        
                {isOwner && (
                <button 
                    className={`${styles.startButton} ${getNumberOfLobbyPlayers() < 2 && styles.disabled} button-reset`} 
                    onClick={handleStartGame}
                >
                    {t('start_game.button')}
                </button>
                )}
            </div>

            <BackgroundImg/>
        </div>
    )
}

export default PageLobby;