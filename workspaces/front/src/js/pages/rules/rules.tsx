import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@app/js/components/header/Header";
import RulesPage1 from "@app/js/components/RulesPage1/RulesPage1";
import RulesPage2 from "@app/js/components/RulesPage2/RulesPage2";
import arrowBack from '@app/assets/icons/arrowBack.png';
import styles from './rules.module.css';
import BackgroundImg from '@app/js/components/BackgroundImage/BackgroundImg';

function Rules() {
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
                    <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/menu')}>
                        <img src={arrowBack} />
                        <span>Retour</span>
                    </div>
                    <h2>Règles du jeu</h2>
                </div>
                {page === 1 ? <RulesPage1 /> : <RulesPage2 />}
            </div>
            <BackgroundImg/>
        </div>
    );
}

export default Rules;
