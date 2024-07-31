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
            <label className={styles.label}><strong>Guide et référentiels</strong></label><br />
            <p>
                <strong>Référentiels au développement green</strong> <div className={styles.linkButton} onClick={() => handleClick(data.lien1)}>Y aller</div><br />
                Avec le soutien de plus de 40 contributeurs membres du collectif conception numérique responsable, GreenIT.fr a mis au point un référentiel de 115 bonnes pratiques d’éco-conception web.<br /><br />
                <strong>Référentiels à la frugalité fonctionnelle</strong> <div className={styles.linkButton} onClick={() => handleClick(data.lien2)}>Y aller</div><br />
                Le GR491 est le Guide de Référence de Coneption Responsable de Services Numériques créé par l’Institut français du Numérique Responsable.<br /><br />
                <strong>Référentiels à l’écoconception tech</strong> <div className={styles.linkButton} onClick={() => handleClick(data.lien3)}>Y aller</div><br />
                Le GR491 est le Guide de Référence de Coneption Responsable de Services Numériques créé par l’Institut français du Numérique Responsable.<br /><br />
            </p>
        </div>
    );
};

export default React.memo(BookletFormation);
