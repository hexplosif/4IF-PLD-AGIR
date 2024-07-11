import React from 'react';
import Header from "@app/js/components/header/Header";

import styles from './credits.module.css';

function Credits() {
  return (
    <div>
        <Header />
        <h1 className={styles.h1}>Projet réalisé par</h1>
        <h2 className={styles.h2}>LEROUX Jade <br/> 
            PIGNOL Sarah <br/>
            PIGEONNAT Meije <br/>
            DELCOURT Lou <br/>
            CHANTREL Thibaut <br/>
            MULLER Grégoire <br/>
        </h2>
        <h3 className={styles.h3}>Dans le cadre du projet Smart, Département Informatique INSA Lyon <br/>
        D'après le jeu de cartes "1 Tonne de Bonnes Pratiques" réalisé par CGI

        </h3>
        <h4>Avril-Mai 2024</h4>
    </div>
  );
}

export default Credits;