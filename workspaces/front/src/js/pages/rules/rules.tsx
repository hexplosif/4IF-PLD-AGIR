import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from "@app/js/components/header/Header";
import RulesPage1 from "@app/js/components/RulesPage1/RulesPage1";
import RulesPage2 from "@app/js/components/RulesPage2/RulesPage2";
import arrowBack from '@app/assets/icons/arrowBack.png';
import styles from './rules.module.css';
import BackgroundImg from '@app/js/components/BackgroundImage/BackgroundImg';

function Rules() {
    const { t } = useTranslation('rules');
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    
    const redirectToPage = (path) => {
        navigate(path);
    };

    const nextPage = () => {
        setPage(2);
    };

    const previousPage = () => {
        setPage(1);
    };

    return (
        <div className={styles.rulesPage}>
            <Header />
            <div className={styles.rulesContainer}>
                <div className={styles.containerHeader}>
                    <div 
                        className={styles.returnToPreviousPage} 
                        onClick={() => redirectToPage('/menu')}
                    >
                        <img src={arrowBack} alt={t('return_button')} />
                        <span>{t('return_button')}</span>
                    </div>
                    <h2>{t('page_title')}</h2>
                </div>
                {page === 1 ? <RulesPage1 /> : <RulesPage2 />}
                <div className={styles.navigationButtons}>
                    {page === 2 && (
                        <button 
                            onClick={previousPage} 
                            className={styles.navigationButton}
                        >
                            {t('navigation.previous')}
                        </button>
                    )}
                    {page === 1 && (
                        <button 
                            onClick={nextPage} 
                            className={styles.navigationButton}
                        >
                            {t('navigation.next')}
                        </button>
                    )}
                </div>
            </div>
            <BackgroundImg/>
        </div>
    );
}

export default Rules;