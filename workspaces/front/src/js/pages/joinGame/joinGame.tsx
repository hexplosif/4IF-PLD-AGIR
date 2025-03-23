import Header from "@app/js/components/header/Header";
import JoinGameC from '@app/js/components/JoinGame/JoinGame';
import styles from './joinGame.module.css'
import { useGameManager } from '@app/js/hooks';
import image from '../../../icons/background-image.jpg';

function JoinGame(){
    useGameManager();

    return (
    <div className={styles.joinGamePage}>
        <Header />
        <JoinGameC />
        <img src={image} alt="Image de la tonne de bonnes pratiques" className={styles.bgImage} />
    </div>)
}

export default JoinGame;