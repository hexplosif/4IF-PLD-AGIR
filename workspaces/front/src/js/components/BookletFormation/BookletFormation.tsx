import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BookletFormation.module.css';

const BookletFormation: React.FC = () => {
    const { t, i18n } = useTranslation('greenIt', {keyPrefix: 'booklet-formation'});
    const currentLanguage = i18n.language;
    
    const links = {
        'lien1': {
            'fr': "https://gr491.isit-europe.org/",
            'en': "https://gr491.isit-europe.org/en/",
            'default': "https://gr491.isit-europe.org/en"
        },
        'lien2': {
            'fr': "https://eco-conception.designersethiques.org/guide/fr/",
            'en': "https://designersethiques.org/en/themes/eco-design/eco-design-guide-for-digital-services",
            'default': "https://designersethiques.org/en/themes/eco-design/eco-design-guide-for-digital-services"
        },
        'lien3': {
            'fr': "https://collectif.greenit.fr/ecoconception-web/",
            'en': "https://collectif.greenit.fr/ecoconception-web/",
            'default': "https://collectif.greenit.fr/ecoconception-web/"
        }
    };
    
    const getLink = (linkKey: string) => {
        const linkOptions = links[linkKey];
        return linkOptions[currentLanguage] || linkOptions['default'];
    };

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