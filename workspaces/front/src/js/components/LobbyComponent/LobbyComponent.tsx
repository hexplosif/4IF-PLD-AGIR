import React, { useState } from 'react';
import styles from './LobbyComponent.module.css';
import { useRecoilState } from 'recoil';
import { CurrentLobbyState } from '../Game/states';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';


const LobbyComponent: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [lobbyState] = useRecoilState(CurrentLobbyState);
  const { sm } = useSocketManager();

  const handleCodeClick = () => {
    setIsCopied(true);

    navigator.clipboard.writeText(lobbyState?.connectionCode || '');

    setTimeout(() => setIsCopied(false), 2000); 
  };


  const handleStartGame = () => {
    console.log('[LobbyComponent] handleStartGame. ClientInGameId:', localStorage.getItem('clientInGameId'));
    console.log('[LobbyComponent] handleStartGame. OwnerId:', lobbyState?.ownerId);
    if ((lobbyState ? Object.keys(lobbyState?.clientsNames).length  : 0 )>= 2){
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
  }

  return (
    <>
       <div className={styles.codeContainer}>
        <label className={`${styles.code} ${isCopied ? styles.copied : ''}`} onClick={handleCodeClick}>
          Code : {lobbyState?.connectionCode}
          <span className={styles.tooltip}>{isCopied ? '' : ''}</span>
        </label>
      </div>
      <div className={styles.container}>
        <label className={styles.label}>Participants : {lobbyState ? Object.keys(lobbyState?.clientsNames).length : 0}/4</label> <br />
        <label className={styles.participant}>{lobbyState?.clientsNames[lobbyState.ownerId]} (Hôte)</label> <br />
        {(lobbyState ? Object.keys(lobbyState?.clientsNames) : []).map((id, index) => {
          if (id === lobbyState?.ownerId) {
            return null;
          }
          return (
            <label key={index} className={styles.participant}>{lobbyState?.clientsNames[id]}</label>
          )
        })}
        {/* <button className={styles.button} onClick={handleStartGame}>Lancer la partie</button> */}
        
        {lobbyState?.ownerId === localStorage.getItem('ownerId') && (
          <button className={styles.button} onClick={handleStartGame}>Lancer la partie</button>
        )} 

      </div>
    </>
  );
};

export default LobbyComponent;
