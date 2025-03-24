import Header from "@app/js/components/header/Header";
import CreateGame from '@app/js/components/CreateGame/CreateGame';
import styles from './createGame.module.css'
import { useGameManager } from "@app/js/hooks";
import image from '@app/assets/images/background-image.jpg';

function PageCreateGame() {
    useGameManager();

    return (
        <div className={styles.createGamePage}>
            <Header />
            <CreateGame />
            <img src={image} alt="Image de la tonne de bonnes pratiques" className={styles.bgImage} />
        </div>
    )
}

export default PageCreateGame;