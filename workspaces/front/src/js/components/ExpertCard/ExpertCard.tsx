import styles from './ExpertCard.module.css';

import iconExpertDev from '@app/assets/images/Expert_dev.webp';
import iconExpertLeadTech from '@app/assets/images/Expert_lead_tech.webp';
import iconExpertProductOwner from '@app/assets/images/Expert_product_owner.webp';

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
