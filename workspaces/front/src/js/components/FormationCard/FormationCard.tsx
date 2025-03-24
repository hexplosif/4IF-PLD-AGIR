import styles from './FormationCard.module.css';

import iconFormationDev from '@app/assets/images/Formation_dev.webp';
import iconFormationLeadTech from '@app/assets/images/Formation_lead_tech.webp';
import iconFormationProductOwner from '@app/assets/images/Formation_product_owner.webp';

import { Formation_Card } from '@shared/common/Cards';

function FormationCard(card:Formation_Card) {

    return (
        <div className={styles.card}>
            <div className={styles.cardheader}>
                <div className={styles.icon}>
                    <img src={card.actor === 'Developer' ? iconFormationDev : card.actor === 'Architect' ? iconFormationLeadTech : card.actor === 'ProductOwner' ? iconFormationProductOwner : iconFormationProductOwner} alt="iconFormation" />
                </div>
                <div style={{marginBottom: "15px"}}>
                <h2>Formation {card.actor==="Developer" ? "Développeur" : card.actor==="Architect" ? "Architecte" : card.actor==="ProductOwner" ? "Product Owner" : " inconnu"}</h2>
                <h3>{card.actor==="Developer" ? "développement green" : card.actor==="Architect" ? "écoconception tech" : card.actor==="ProductOwner" ? "frugalité fonctionnelle" : "type inconnu"}</h3>
                </div>
            </div>


            <div className={styles.description}>
                <div className={styles.descriptionheader}>
                    <h3>{card.title ? card.title : "Sample title"}</h3>
                </div>
                <div className={styles.descriptionbody}>
                    <p>{card.contents? card.contents : "blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla "}</p>
                </div>
            </div>

        </div>

    );
}

export default FormationCard;
