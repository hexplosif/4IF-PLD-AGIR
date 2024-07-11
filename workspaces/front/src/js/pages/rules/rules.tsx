import React, { useState } from 'react';
import Header from "@app/js/components/header/Header";
import RulesPage1 from "@app/js/components/RulesPage1/RulesPage1";
import RulesPage2 from "@app/js/components/RulesPage2/RulesPage2";
import next from '@app/icons/next.webp';
import styles from './rules.module.css';

function Rules() {
    const [page, setPage] = useState(1);

    const nextPage = () => {
        setPage(2);
    };

    const previousPage = () => {
        setPage(1);
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <label className={styles.label}>Règles du jeu</label><br />
                {page === 1 ? <RulesPage1 /> : <RulesPage2 />}
                <div className={styles.navigationButtons}>
                    {page === 1 && (<img src={next} alt="Next" className={styles.nextButton} onClick={nextPage} />)}
                    {page === 2 && (<img src={next} alt="Previous" className={styles.prevButton} onClick={previousPage} />)}
                </div>
            </div>
        </div>
    );
}

export default Rules;
