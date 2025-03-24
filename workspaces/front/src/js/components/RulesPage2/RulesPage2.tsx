import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RulesPage2.module.css';
import cardCaption from '@app/assets/icons/CardCaption.webp';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";

const RulesPage2: React.FC = () => {
    const cards= [
        { cardType: 'BestPractice', id: '32', title: 'Titre de la bonne pratique', contents: 'Description ', carbon_loss : 50 }
    ];


    return (
        <div className={styles.container}>
            <div className={styles.cardCaptionContainer}>
                <img src={cardCaption} alt="cardCaption" className={styles.cardCaption} />
            </div>
            <div className={styles.section1}>
                <p>
                    <strong>Anatomie d'une carte bonne pratique : </strong><br /><br />
                </p>
            </div>
            <div className={styles.section2}>
                <p>
                <strong>Les cartes bonnes pratiques : </strong><br />
                Ces cartes présentent des pratiques à mettre en place dans son environnement de travail  qui sont plus repectueuses de l’environnement. Pour gagner, le joueur doit économiser un certain nombre de kg de CO2 que le maître du jeu définit en début de partie. Lorsqu’un joueur pose cette carte, il peut choisir si cette pratique est applicable ou pas dans son quotidien. Si c’est le cas, il pourra la retrouver dans son carnet Green IT.<br /><br />
                <strong>Les cartes de mauvaises pratiques : </strong><br />
                Les cartes mauvaises pratiques sont jouées pour bloquer un autre utilisateur. Celui-ci devra poser une carte formation ou expert pour se débloquer et pouvoir jouer à nouveau des cartes bonnes pratiques. Pour la jouer, il faut que le joueur selectionnier ne soit pas déjà sous l'influence d'une mauvaise pratique<br /><br />
                <strong>Les cartes formation : </strong><br />
                Si un joueur est bloqué par une carte mauvaise pratique, il peut se libérer grâce à une carte formation de même nature. Il pourra retrouver sa formation dans son carnet Green IT à la fin de la partie.<br /><br />
                <strong>Les points de sensibilisation : </strong><br />
                A chaque fin de tour, un qcm de sensibilisation s’affiche. Les joueurs ont 15 secondes pour y répondre et cumule en cas de réponse correcte des points de sensibilisation. Si le joueur est bloqué par une carte mauvaise pratique, il peut utliser 1 point pour piocher une carte formation ou 3 points pour piocher la bonne carte formation qui lui permet de se libérer.<br /><br />
                <strong>Les cartes expert : </strong><br />
                Poser une carte expert permet de contrecarrer une carte mauvaise pratique de même nature ou pour se protéger de cartes mauvaises pratiques à venir.<br /><br />
                </p>
            </div>
        </div>
    );
};

export default RulesPage2;
