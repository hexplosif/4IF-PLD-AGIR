import Header from "@app/js/components/header/Header";
import styles from './menu.module.css';
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import plus from '@app/assets/icons/plus.png';
import play from '@app/assets/icons/play.png';
import book from '@app/assets/icons/book.png';
import rules from '@app/assets/icons/rules.png';
import cards from '@app/assets/icons/cards.png';
import hashtag from '@app/assets/icons/hashtag.png';

function Menu() {

    const navigate = useNavigate();
    const { t } = useTranslation("menu");

    const redirectToPage = (path) => {
        navigate(path);
    };

    return (
        <div className={styles.menuPage}>

            <Header />

            <div className={styles.menuContainer}>
                <h2>{t("menu-cards.title")}</h2>

                <div className={styles.menuCardContainer}>

                    <div className={styles.menuCard} onClick={() => redirectToPage('/createGame')}>
                        <span>{t("menu-cards.create-game")}</span>
                        <img src={plus} alt="+" />
                    </div>

                    <div className={styles.menuCard} onClick={() => redirectToPage('/joinGame')}>
                        <span>{t("menu-cards.join-game")}</span>
                        <img src={play} alt=">" />
                    </div>

                    <div className={styles.menuCard} onClick={() => redirectToPage('/greenIt')}>
                        <span>{t("menu-cards.green-it")}</span>
                        <img src={book} alt="Green IT Notebook" />
                    </div>

                    <div className={styles.menuCard} onClick={() => redirectToPage('/rules')}>
                        <span>{t("menu-cards.rules")}</span>
                        <img src={rules} alt="Game Rules" />
                    </div>

                    <div className={styles.menuCard} onClick={() => redirectToPage('/viewCards')}>
                        <span>{t("menu-cards.view-cards")}</span>
                        <img src={cards} alt="View Cards" />
                    </div>

                    <div className={styles.menuCard} onClick={() => redirectToPage('/credits')}>
                        <span>{t("menu-cards.credits")}</span>
                        <img src={hashtag} alt="Credits" />
                    </div>

                </div>
            </div>

            <BackgroundImg />

        </div>
    );
}

export default Menu;
