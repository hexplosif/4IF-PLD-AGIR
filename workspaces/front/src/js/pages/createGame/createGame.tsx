import React from 'react';
import Header from "@app/js/components/header/Header";
import CreateGame from '@app/js/components/CreateGame/CreateGame';
import GameManager from '@app/js/components/Game/GameManager';
function PageCreateGame(){
    return (
        <div>
        <Header />
        <GameManager />
        <CreateGame />
        </div>
    )
}

export default PageCreateGame;