import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RulesPage2.module.css';
import cardCaption from '@app/assets/images/CardCaption.webp';

const RulesPage2: React.FC = () => {
    const { t } = useTranslation('rules', {keyPrefix: 'page2'});
    
    const cards= [
        { cardType: 'BestPractice', id: '32', title: t('cardAnatomyTitle'), contents: 'Description ', carbon_loss : 50 }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.cardCaptionContainer}>
                <img src={cardCaption} alt="cardCaption" className={styles.cardCaption} />
            </div>
            <div className={styles.section1}>
                <p>
                    <strong>{t('cardAnatomyTitle')}</strong><br /><br />
                </p>
            </div>
            <div className={styles.section2}>
                <p>
                    <strong>{t('sections.goodPracticeCards.title')}</strong><br />
                    {t('sections.goodPracticeCards.description')}<br /><br />
                    
                    <strong>{t('sections.badPracticeCards.title')}</strong><br />
                    {t('sections.badPracticeCards.description')}<br /><br />
                    
                    <strong>{t('sections.trainingCards.title')}</strong><br />
                    {t('sections.trainingCards.description')}<br /><br />
                    
                    <strong>{t('sections.awarenessPoints.title')}</strong><br />
                    {t('sections.awarenessPoints.description')}<br /><br />
                    
                    <strong>{t('sections.expertCards.title')}</strong><br />
                    {t('sections.expertCards.description')}<br /><br />
                </p>
            </div>
        </div>
    );
};

export default RulesPage2;