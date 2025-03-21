import Header from "@app/js/components/header/Header";
import JoinGameC from '@app/js/components/JoinGame/JoinGame';
import { useGameManager } from '@app/js/hooks';
function JoinGame(){
    useGameManager();

    return (<>
        <Header />
        <JoinGameC />
    </>)
}

export default JoinGame;