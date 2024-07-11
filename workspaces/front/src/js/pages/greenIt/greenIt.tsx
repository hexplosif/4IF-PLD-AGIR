// GreenIt.js

import React, { useState } from 'react';
import Header from "@app/js/components/header/Header";
import BookletFormation from "@app/js/components/BookletFormation/BookletFormation";
import BookletStats from "@app/js/components/BookletStats/BookletStats";
import BookletBP from "@app/js/components/BookletBP/BookletBP";
import BookletMP from "@app/js/components/BookletMP/BookletMP";
import next from '@app/icons/next.webp';
import styles from './greenIt.module.css';

function GreenIt() {
    const [page, setPage] = useState(1); 
    const [animationVisible, setAnimationVisible] = useState(false);

    const nextPage = () => {
        setAnimationVisible(true); // Affiche l'animation
        setTimeout(() => {
            setPage(page === 1 ? 2 : 1);
            setAnimationVisible(false); // Cache l'animation après la transition
        }, 500); // Temps de la transition en millisecondes
    };

    const previousPage = () => {
        setAnimationVisible(true); // Affiche l'animation
        setTimeout(() => {
            setPage(page === 1 ? 2 : 1);
            setAnimationVisible(false); // Cache l'animation après la transition
        }, 500); // Temps de la transition en millisecondes
    };

    return (
        <div>
            <Header />
            <label className={styles.label}>Mon carnet Green IT</label><br />
            <div className={styles.cover}>
                <div className={styles.pageLeft}>
                    {page === 1 ? <BookletFormation /> : <BookletBP />}
                </div>
                <div className={styles.pageRight}>
                    {page === 1 ? <BookletStats /> : <BookletMP />}
                </div>
                <div className={`${styles.pageAnimation} ${animationVisible ? styles.visible : ''}`}>
                    {/* {page === 1 ? <BookletStats /> : <BookletMP />} */}
                </div>
                <div className={styles.navigationButtons}>
                    <img src={next} alt="Next" className={`${styles.nextButton} ${page === 2 ? styles.disabled : ''}`} onClick={nextPage} />
                    <img src={next} alt="Previous" className={`${styles.prevButton} ${page === 1 ? styles.disabled : ''}`} onClick={previousPage} />
                </div>
            </div>
        </div>
    );
}

export default GreenIt;
