import React from 'react';

import styles from './MenuComponent.module.css';
import { useNavigate } from "react-router-dom";

const MenuComponent = () => {
    const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation
    
    // Fonction pour rediriger vers la page associée
    const redirectToPage = (path) => {
        navigate(path);
    };

    return (
        <div className={styles.container}>
            {/* Boutons avec des fonctions onClick pour rediriger vers les pages associées */}
            <button className={styles.button} onClick={() => redirectToPage('/createGame')}>Créer une partie</button>
            <button className={styles.button} onClick={() => redirectToPage('/joinGame')}>Rejoindre une partie</button>
            <button className={styles.button} onClick={() => redirectToPage('/greenIt')}>Carnet Green IT</button>
            <button className={styles.button} onClick={() => redirectToPage('/rules')}>Règles du jeu</button>
            <button className={styles.button} onClick={() => redirectToPage('/viewCards')}>Visualiser les cartes</button>
            <br/>
            <br/>
            <label className={styles.label} onClick={() => redirectToPage('/credits')}>Crédits</label>
        </div>
    );
};
export default MenuComponent;