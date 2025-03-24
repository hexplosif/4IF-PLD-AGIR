import React from 'react';

import styles from './MenuComponent.module.css';
import { useNavigate } from "react-router-dom";
import plus from '@app/assets/icons/plus.png';
import play from '@app/assets/icons/play.png';
import book from '@app/assets/icons/book.png';
import rules from '@app/assets/icons/rules.png';
import cards from '@app/assets/icons/cards.png';
import hashtag from '@app/assets/icons/hashtag.png';

const MenuComponent = () => {
    const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

    // Fonction pour rediriger vers la page associée
    const redirectToPage = (path) => {
        navigate(path);
    };

    return (
        <div className={styles.menuContainer}>

            <h2>Menu</h2>

            <div className={styles.menuCardContainer}>

                <div className={styles.menuCard} onClick={() => redirectToPage('/createGame')}>
                    <span>Créer une partie</span>
                    <img src={plus} alt='+' />
                </div>

                <div className={styles.menuCard} onClick={() => redirectToPage('/joinGame')}>
                    <span>Rejoindre une partie</span>
                    <img src={play} alt='>' />
                </div>

                <div className={styles.menuCard} onClick={() => redirectToPage('/greenIt')}>
                    <span>Carnet Green IT</span>
                    <img src={book} alt='Le livre du Green IT' />
                </div>

                <div className={styles.menuCard} onClick={() => redirectToPage('/rules')}>
                    <span>Règles du jeu</span>
                    <img src={rules} alt='Règles du jeu' />
                </div>

                <div className={styles.menuCard} onClick={() => redirectToPage('/viewCards')}>
                    <span>Visualiser les cartes</span>
                    <img src={cards} alt='Visualiser les cartes' />
                </div>

                <div className={styles.menuCard} onClick={() => redirectToPage('/credits')}>
                    <span>Crédits</span>
                    <img src={hashtag} alt='Crédits' />
                </div>


            </div>

        </div>
    );
};
export default MenuComponent;