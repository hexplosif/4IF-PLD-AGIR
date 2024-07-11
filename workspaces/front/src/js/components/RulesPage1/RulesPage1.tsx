import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RulesPage1.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import FormationCard from "@app/js/components/FormationCard/FormationCard";
import ExpertCard from "@app/js/components/ExpertCard/ExpertCard";

const RulesPage1: React.FC = () => {
    const cards= [
        { cardType: 'BestPractice', id: '32', title: 'Titre de la bonne pratique', contents: 'Description DescriptionDescription DescriptionDescription DescriptionDescription Description Description Description Description DescriptionDescriptionDescription DescriptionDescriptionDescription Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description', carbon_loss : 50 },
        { cardType: 'BadPractice', id: '32', title: 'Titre de la mauvaise pratique', contents: 'Description ', targetedPlayer: 'Architect' },
        { cardType: 'Expert', id: '32', actor: 'ProductOwner', title: 'Type dexpertise', contents: '' },
        { cardType: 'Formation', id: '32', actor: 'Developer', title: 'Nom de la ressource', contents: 'Description' },
    ];


    return (
        <div className={styles.container}>
            <div className={styles.section1}>
                <p>
                    <strong>Nombre de participants :</strong> 3 à 5 joueurs<br /><br />
                    <strong>But du jeu :</strong> être le premier à avoir suffisamment de bonnes pratiques pour économiser au moins 1T (1000kg) de CO2 via des pratiques de Green IT. Si vous êtes pressés, vous pouvez définir un nouvel objectif (600kg ou 800kg).<br /><br />
                    <strong>Préparation du jeu :</strong><br />
                    - Chaque joueur reçoit 7 cartes aléatoirement<br />
                    - Le joueur qui commence est tiré au sort
                </p>
            </div>
            <div className={styles.section2}>
                <p>
                <strong>Déroulement d’un tour : </strong>
                    Le jeu commence par une question de sensibilisation à choix multiple posée à l’ensemble des joueurs. Une bonne réponse permet au joueur de commencer à jouer. Une mauvaise réponse bloque le joueur jusqu’à ce qu’il réponde correctement.<br /><br />
                    A son tour, le joueur peut jouer une des cartes suivantes ou défausser une carte s’il lui est impossible de jouer :
                </p>
                <div className={styles.cardContainer}>
                    {cards.map((card, index) => (
                        <div key={index} className={styles.card}>
                            {card.cardType === 'BestPractice' && (
                                <>
                                    <BestPracticeCard  title={card.title} contents={card.contents} carbon_loss={card.carbon_loss} />
                                    <p className={styles.cardTitle}>Carte bonne pratique</p>
                                </>
                            )}
                            {card.cardType === 'BadPractice' && (
                                <>
                                    <BadPracticeCard title={card.title} contents={card.contents} targetedPlayer={card.targetedPlayer} />
                                    <p className={styles.cardTitle}>Carte mauvaise pratique</p>
                                </>
                            )}
                            {card.cardType === 'Formation' && (
                                <>
                                    <FormationCard title={card.title} contents={card.contents} actor={card.actor} />
                                    <p className={styles.cardTitle}>Carte formation</p>
                                </>
                            )}
                            {card.cardType === 'Expert' && (
                                <>
                                    <ExpertCard title={card.title} contents={card.contents} actor={card.actor} />
                                    <p className={styles.cardTitle}>Carte Expert</p>
                                </>
                            )}
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RulesPage1;
