import React, { useState } from 'react';

import styles from './BestPracticeCard.module.css';
import iconBestPractice from '@app/icons/icon_goodpractice.webp';
import actorDevIcon from '../../images/nobg_Expert_dev.webp';
import actorLeadTechIcon from '../../images/nobg_Expert_lead_tech.webp';
import actorProductOwnerIcon from '../../images/nobg_Expert_product_owner.webp';

import networkGain from '../../images/networkGain.webp';
import cpuGain from '../../images/cpuGain.webp';
import storageGain from '../../images/storageGain.webp';
import memoryGain from '../../images/memoryGain.webp';

import { Best_Practice_Card, Difficulty } from '@shared/common/Cards';



function BestPracticeCard(card:Best_Practice_Card) {

    let actorIcon = actorDevIcon;
    if (card.actor === "Architect") {
        actorIcon = actorLeadTechIcon;
    } else if (card.actor === "ProductOwner") {
        actorIcon = actorProductOwnerIcon;
    }


    return (
        <div className={styles.card}>
            <div className={styles.cardheader}>
                <div className={styles.icon}>
                    <img src={iconBestPractice} alt="iconBestPractice" />
                </div>
                <h2>Bonne pratique</h2>
            </div>
            <div className={styles.cardPoids}>
                <p>{card.carbon_loss >= 0 && card.carbon_loss <= 200 ? card.carbon_loss : "?? "} kg</p>
            </div>
            <div className={styles.cardbody}>
                <p>CO2 économisés</p>
            </div>

            <div className={styles.description}>
                <div className={styles.descriptionheader}>
                    <h3>{card.title ? card.title : "Sample title"}</h3>
                </div>
                <div className={styles.descriptionbody}>
                    <p>{card.contents? card.contents : "sample desc blabla bla bla blabla "}</p>
                </div>
            </div>

            <div className={styles.cardfooter}>
                <div className={styles.actor}>
                    <p>Acteur</p>
                    <div className={styles.footericon} style={{transform: "scale(1.5)", marginTop: "-2.3px"}}>
                        <img src={actorIcon} alt="actorIcon" />
                    </div>
                </div>
                <div className={styles.component}>
                    <p>Composant</p>
                    <div className={styles.footericon}>
                        <img src={memoryGain} alt="actorIcon" />
                        </div>
                </div>
                <div className={styles.gains}>
                    <p>Gains</p>
                    <div className={styles.footericonGains}>
                        {card.network_gain===true ?
                        <img src={networkGain} alt="actorIcon" />
                        : null}
                        {card.cpu_gain===true ?
                        <img src={cpuGain} alt="actorIcon" />
                        : null}
                        {card.storage_gain===true ?
                        <img src={storageGain} alt="actorIcon" />
                        : null}
                        {card.memory_gain===true ?
                        <img src={memoryGain} alt="actorIcon" />
                        : null}

                    </div>
                </div>
                <div className={styles.difficulty}>
                    <p>Difficulté</p>
                    <div className={styles.stars}>
                        <span>{card.difficulty === Difficulty.ONE ? "★☆☆☆":""}</span>
                        <span>{card.difficulty === Difficulty.TWO ? "★★☆☆" : ""}</span>
                        <span>{card.difficulty === Difficulty.THREE ? "★★★☆" : ""}</span>
                        <span>{card.difficulty === Difficulty.FOUR ? "★★★★" : ""}</span>
                    </div>
                </div>

            </div>

        </div>

    );
}

export default BestPracticeCard;
