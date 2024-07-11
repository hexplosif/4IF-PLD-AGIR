import React from 'react';
import Header from "@app/js/components/header/Header";
import JoinGameC from '@app/js/components/JoinGame/JoinGame';
import GameManager from '@app/js/components/Game/GameManager';
function JoinGame(){
    return (
        <div>
        <Header />
        <GameManager />
        <JoinGameC />
        </div>
    )
}

export default JoinGame;