import Header from "@app/js/components/header/Header";
import CreateGame from '@app/js/components/CreateGame/CreateGame';
import styles from './createGame.module.css'
import { useGameManager } from "@app/js/hooks";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";


function PageCreateGame() {
    useGameManager();

    return (
        <div className={styles.createGamePage}>
            <Header />
            <CreateGame />
            <BackgroundImg/>
        </div>
    )
}

export default PageCreateGame;