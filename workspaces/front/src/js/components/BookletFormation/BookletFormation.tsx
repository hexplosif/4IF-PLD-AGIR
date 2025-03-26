import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './BookletFormation.module.css';

const BookletFormation: React.FC = () => {
    const { t } = useTranslation('greenIt', {keyPrefix: 'booklet-formation'});
    
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
            <h3>{t('title')}</h3>
            <div className={styles.reference}>
                <div className={styles.referenceText}>
                    <h4>{t('references.green_development.title')}</h4>
                    <p>{t('references.green_development.description')}</p>
                </div>
                <button 
                    className={styles.linkButton} 
                    onClick={() => handleClick(data.lien1)}
                >
                    {t('references.green_development.button')}
                </button>
            </div>
            <div className={styles.reference}>
                <div className={styles.referenceText}>
                    <h4>{t('references.functional_frugality.title')}</h4>
                    <p>{t('references.functional_frugality.description')}</p>
                </div>
                <button 
                    className={styles.linkButton} 
                    onClick={() => handleClick(data.lien2)}
                >
                    {t('references.functional_frugality.button')}
                </button>
            </div>
            <div className={styles.reference}>
                <div className={styles.referenceText}>
                    <h4>{t('references.tech_ecodesign.title')}</h4>
                    <p>{t('references.tech_ecodesign.description')}</p>
                </div>
                <button 
                    className={styles.linkButton} 
                    onClick={() => handleClick(data.lien3)}
                >
                    {t('references.tech_ecodesign.button')}
                </button>
            </div>
        </div>
    );
};

export default React.memo(BookletFormation);