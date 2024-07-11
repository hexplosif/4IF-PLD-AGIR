import React, { useState } from 'react';

import styles from './ExpertCard.module.css';

import iconExpertDev from '../../images/Expert_dev.webp';
import iconExpertLeadTech from '../../images/Expert_lead_tech.webp';
import iconExpertProductOwner from '../../images/Expert_product_owner.webp';

import illustration from '@app/icons/illustration_expert.webp';

import actorIcon from '@app/icons/actor_icon.webp';

import { Expert_Card } from '@shared/common/Cards';

function ExpertCard(card:Expert_Card) {

    return (
        <>
        <div className={styles.card}>

            <div className={styles.cardheader}>
                <div className={styles.icon}>
                    <img src={card.actor === 'Developer' ? iconExpertDev : card.actor === 'Architect' ? iconExpertLeadTech : card.actor === 'ProductOwner' ? iconExpertProductOwner : iconExpertDev} alt="iconFormation" />
                </div>
                <div style={{marginBottom: "15px"}}>
                <h2>Expert {card.actor==="Developer" ? "Développeur" : card.actor==="Architect" ? "Architecte" : card.actor==="ProductOwner" ? "Product Owner" : " inconnu"}</h2>
                <h3>{card.actor==="Developer" ? "artisan écoresponsable" : card.actor==="Architect" ? "logiciel écoresponsable" : card.actor==="ProductOwner" ? "écoresponsable" : "inconnu écoresponsable"}</h3>
                </div>
            </div>

        </div>
        </>

    );
}

export default ExpertCard;
