import Header from "@app/js/components/header/Header";
import JoinGameC from '@app/js/components/JoinGame/JoinGame';
import styles from './joinGame.module.css'
import { useGameManager } from '@app/js/hooks';
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";

function JoinGame(){
    useGameManager();

    return (
    <div className={styles.joinGamePage}>
        <Header />
        <JoinGameC />
        <BackgroundImg/>
    </div>)
}

export default JoinGame;