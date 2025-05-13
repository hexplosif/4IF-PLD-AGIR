import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './BookletFormation.module.css';

const BookletFormation: React.FC = () => {
    const { t, i18n } = useTranslation('greenIt', {keyPrefix: 'booklet-formation'});
    const currentLanguage = i18n.language; // Obtenir la langue actuelle
    
    // Liens organisés par langue et par ressource
    const links = {
        // GR491 (premier lien)
        'lien1': {
            'fr': "https://gr491.isit-europe.org/",
            'en': "https://gr491.isit-europe.org/en/",
            'default': "https://gr491.isit-europe.org/en"
        },
        // Designers Éthiques (deuxième lien)
        'lien2': {
            'fr': "https://eco-conception.designersethiques.org/guide/fr/",
            'en': "https://designersethiques.org/en/themes/eco-design/eco-design-guide-for-digital-services",
            'default': "https://designersethiques.org/en/themes/eco-design/eco-design-guide-for-digital-services"
        },
        // Collectif Green IT (troisième lien)
        'lien3': {
            'fr': "https://collectif.greenit.fr/ecoconception-web/",
            'en': "https://collectif.greenit.fr/ecoconception-web/", // Si une version anglaise existe en ajouter une ici
            'default': "https://collectif.greenit.fr/ecoconception-web/"
        }
    };
    
    // Fonction pour obtenir le lien correct selon la langue
    const getLink = (linkKey: string) => {
        const linkOptions = links[linkKey];
        // Utiliser le lien pour la langue actuelle s'il existe, sinon utiliser le lien par défaut
        return linkOptions[currentLanguage] || linkOptions['default'];
    };

    const navigate = useNavigate();

    const handleClick = (linkKey: string) => {
        const url = getLink(linkKey);
        window.open(url, "_blank");
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
                    onClick={() => handleClick('lien1')}
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
                    onClick={() => handleClick('lien2')}
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
                    onClick={() => handleClick('lien3')}
                >
                    {t('references.tech_ecodesign.button')}
                </button>
            </div>
        </div>
    );
};

export default React.memo(BookletFormation);