import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookletFormation.module.css';

const BookletFormation: React.FC = () => {
    const data = {
        lien1: "https://gr491.isit-europe.org/",
        lien2: "https://eco-conception.designersethiques.org/guide/fr/",
        lien3: "https://collectif.greenit.fr/ecoconception-web/",
    };

    const navigate = useNavigate();

    const handleClick = (link: string) => {
        window.open(link, "_blank");
    };


    return (
        <div className={styles.container}>
            <h3>Guide et référentiels</h3>
            <div className={styles.reference}>
                <div className={styles.referenceText}>
                    <h4>Référentiels au développement green</h4>
                    <p>Avec le soutien de plus de 40 contributeurs membres du collectif conception numérique responsable, GreenIT.fr a mis au point un référentiel de 115 bonnes pratiques d’éco-conception web.</p>
                </div>
                <button className={styles.linkButton} onClick={() => handleClick(data.lien1)}>Y aller</button>
            </div>
            <div className={styles.reference}>
                <div className={styles.referenceText}>
                    <h4>Référentiels à la frugalité fonctionnelle</h4>
                    <p>Le GR491 est le Guide de Référence de Coneption Responsable de Services Numériques créé par l'Institut français du Numérique Responsable.</p>
                </div>
                <button className={styles.linkButton} onClick={() => handleClick(data.lien2)}>Y aller</button>
            </div>
            <div className={styles.reference}>
                <div className={styles.referenceText}>
                    <h4>Référentiels à l'écoconception tech</h4>
                    <p>Le GR491 est le Guide de Référence de Coneption Responsable de Services Numériques créé par l'Institut français du Numérique Responsable.</p>
                </div>
                <button className={styles.linkButton} onClick={() => handleClick(data.lien3)}>Y aller</button>
            </div>
        </div>
    );
};

export default React.memo(BookletFormation);
