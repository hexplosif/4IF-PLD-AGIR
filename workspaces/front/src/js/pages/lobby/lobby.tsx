import React from 'react';
import Header from "@app/js/components/header/Header";
import LobbyComponent from '@app/js/components/LobbyComponent/LobbyComponent';
import GameManager from '@app/js/components/Game/GameManager';
function PageLobby(){
    return (
        <div>
        <Header />
        <GameManager />
        </div>
    )
}

export default PageLobby;