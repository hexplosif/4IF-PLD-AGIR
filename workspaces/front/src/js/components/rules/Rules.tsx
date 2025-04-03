import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RulesPage1.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import FormationCard from "@app/js/components/FormationCard/FormationCard";
import ExpertCard from "@app/js/components/ExpertCard/ExpertCard";
import { Actor, Difficulty } from '@shared/common/Cards';

const RulesPage1: React.FC = () => {
    const { t } = useTranslation('rules', {keyPrefix: 'page1'});
    
    const cards= [
        { cardType: 'BestPractice', id: '32', title: t('cardTypes.bestPractice'), contents: 'Description DescriptionDescription DescriptionDescription DescriptionDescription Description Description Description Description DescriptionDescriptionDescription DescriptionDescriptionDescription Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description', carbon_loss : 50 },
        { cardType: 'BadPractice', id: '32', title: t('cardTypes.badPractice'), contents: 'Description ', targetedPlayer: 'Architect' },
        { cardType: 'Expert', id: '32', actor: 'ProductOwner', title: t('cardTypes.expert'), contents: '' },
        { cardType: 'Formation', id: '32', actor: 'Developer', title: t('cardTypes.formation'), contents: 'Description' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.section1}>
                <p>
                    <strong>{t('participants')}</strong><br /><br />
                    <strong>{t('gameObjective')}</strong><br /><br />
                    <strong>{t('gamePreparation.title')}</strong><br />
                    - {t('gamePreparation.steps.0')}<br />
                    - {t('gamePreparation.steps.1')}
                </p>
            </div>
            <div className={styles.section2}>
                <p>
                    <strong>{t('turnSequence.title')}</strong>
                    {t('turnSequence.description')}<br /><br />
                    {t('turnSequence.playerActions')}
                </p>
                <div className={styles.cardContainer}>
                    {cards.map((card, index) => (
                        <div key={index} className={styles.card}>
                            {card.cardType === 'BestPractice' && (
                                <>
                                    <BestPracticeCard 
                                        title={card.title} 
                                        contents={card.contents} 
                                        carbon_loss={card.carbon_loss} 
                                        cardType={'BestPractice'} 
                                        network_gain={false} 
                                        memory_gain={false} 
                                        cpu_gain={false} 
                                        storage_gain={false} 
                                        difficulty={Difficulty.ONE} 
                                        id={''} 
                                        actor={Actor.ARCHITECT} 
                                    />
                                    <p className={styles.cardTitle}>{card.title}</p>
                                </>
                            )}
                            {card.cardType === 'BadPractice' && (
                                <>
                                    <BadPracticeCard 
                                        title={card.title} 
                                        contents={card.contents} 
                                        targetedPlayerId={card.targetedPlayer} 
                                        cardType={'BadPractice'} 
                                        network_gain={false} 
                                        memory_gain={false} 
                                        cpu_gain={false} 
                                        storage_gain={false} 
                                        difficulty={Difficulty.ONE} 
                                        id={''} 
                                        actor={Actor.ARCHITECT} 
                                    />
                                    <p className={styles.cardTitle}>{card.title}</p>
                                </>
                            )}
                            {card.cardType === 'Formation' && (
                                <>
                                    <FormationCard 
                                        title={card.title} 
                                        contents={card.contents} 
                                        cardType={'Formation'} 
                                        linkToFormation={''} 
                                        id={''} 
                                        actor={Actor.ARCHITECT} 
                                    />
                                    <p className={styles.cardTitle}>{card.title}</p>
                                </>
                            )}
                            {card.cardType === 'Expert' && (
                                <>
                                    <ExpertCard 
                                        title={card.title} 
                                        contents={card.contents} 
                                        cardType={'Expert'} 
                                        id={''} 
                                        actor={Actor.ARCHITECT}  
                                    />
                                    <p className={styles.cardTitle}>{card.title}</p>
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