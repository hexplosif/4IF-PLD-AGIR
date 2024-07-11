import React, { useState } from 'react';
import styles from './PlayerStatus.module.css';
import { PlayerStateInterface } from '@shared/common/Game';

// Importez vos images
import expertDev from '../../images/Expert_dev.webp';
import expertPO from '../../images/Expert_product_owner.webp';
import expertLT from '../../images/Expert_lead_tech.webp';
import bpDev from '../../images/MP_dev.webp';
import bpPO from '../../images/MP_product_owner.webp';
import bpLT from '../../images/MP_lead_tech.webp';

import Tooltip from '../Tooltip/Tooltip';

function PlayerStatus({ playerstate, me }) {

    let expert = playerstate.expertCards;
    let bp = playerstate.badPractice;
    let sensibilisation = playerstate.sensibilisationPoints;

    let bpImageSrc = null;


    if (bp === "Developer") {
        bpImageSrc = bpDev;
    } else if (bp === "Architect") {
        bpImageSrc = bpLT;
    } else if (bp === "ProductOwner") {
        bpImageSrc = bpPO;
    }

    return (
        <div className={me === 1 ? styles.statusMe : styles.status}>
            <div className={me === 1 ? styles.container2Me : styles.container2}>
                <div className={styles.scoreContainer}>
                    <label
                        className={styles.label}
                    >
                        {playerstate.co2Saved}
                    </label>
                    <label className={styles.label} style={{ fontSize: '18px', letterSpacing: '0.2px', marginTop: '9px' }}> kg</label>
                </div>
                <div className={styles.imagesContainer}>
                    {expert && expert.map((e, index) => {
                        let expertImageSrc = null;
                        if (e === "Developer") {
                            expertImageSrc = expertDev;
                        } else if (e === "Architect") {
                            expertImageSrc = expertLT;
                        } else if (e === "ProductOwner") {
                            expertImageSrc = expertPO;
                        }
                        return (
                        <div className={styles.imgContainer} key={index}>
                        <Tooltip key={index} content={e}>
                        <img key={index} src={expertImageSrc} alt="Carte expert" className={styles.cardImage} />
                        </Tooltip>
                        </div>
                        );
                        
                    })}
                </div>
                <div className={styles.imgContainer}>
                <Tooltip content={bp}>
                {bp !== "" && bpImageSrc && <img src={bpImageSrc} alt="Carte BP" className={styles.cardImage} />}
                </Tooltip>
                </div>
                <div className={styles.points}>
                <Tooltip content="Points de sensibilisation"> {}
                    <label className={styles.labelPoints}>{sensibilisation >= 1 ? "⬤" : "○"}</label>
                    <label className={styles.labelPoints}>{sensibilisation >= 2 ? "⬤" : "○"}</label>
                    <label className={styles.labelPoints}>{sensibilisation >= 3 ? "⬤" : "○"}</label>
                    <label className={styles.labelPoints}>{sensibilisation >= 4 ? "⬤" : "○"}</label>
                    <label className={styles.labelPoints}>{sensibilisation >= 5 ? "⬤" : "○"}</label>
                    </Tooltip>

                    </div>
            </div>
        </div>
    );
}

export default PlayerStatus;
