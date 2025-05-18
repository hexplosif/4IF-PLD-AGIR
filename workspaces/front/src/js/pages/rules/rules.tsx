import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from "@app/js/components/header/Header";
import arrowBack from '@app/assets/icons/arrowBack.png';
import styles from './rules.module.css';
import BackgroundImg from '@app/js/components/BackgroundImage/BackgroundImg';
import cardCaption from '@app/assets/images/CardCaption.webp';
import { GameCard } from '@app/components/card';


function Rules() {
    const { t } = useTranslation('rules');
    const [cards, setCards] = useState([]);


    const navigate = useNavigate();

    const redirectToPage = (path) => {
        navigate(path);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/card/all-cards`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(t('errors.fetch_cards'));
                }
                const allCards = await response.json();

                // Filtrer pour ne garder qu'une seule carte par type
                const uniqueCards = {};
                const filteredCards = allCards.filter(card => {
                    if (!uniqueCards[card.cardType]) {
                        uniqueCards[card.cardType] = true;
                        return true;
                    }
                    return false;
                });

                setCards(filteredCards);
            } catch (error) {
                console.error('Error fetching card info:', error.message);
                throw error;
            }
        }
        fetchData();
    }, [t]);


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
                <div className={styles.rules}>

                    <div className={styles.leftSide}>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('participants.title')}</p>
                            <p className={styles.rulesTextContent}>{t('participants.description')}</p>
                        </div>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('gameObjective.title')}</p>
                            <p className={styles.rulesTextContent}>{t('gameObjective.description')}</p>
                        </div>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('gamePreparation.title')}</p>
                            <ul className={styles.rulesTextContent}>
                                <li>{t('gamePreparation.steps.0')}</li>
                                <li>{t('gamePreparation.steps.1')}</li>
                            </ul>
                        </div>

                        <div className={styles.cardCaptionContainer}>
                            <p className={styles.rulesTextTitle}>{t('cardAnatomyTitle')}</p>
                            <img src={cardCaption} alt="cardCaption" className={styles.cardCaption} />
                        </div>
                    </div>

                    <div className={styles.rightSide}>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('turnSequence.title')}</p>
                            <p className={styles.rulesTextContent}>{t('turnSequence.description')}</p>
                            <p className={styles.rulesTextContent}>{t('turnSequence.playerActions')}</p>
                        </div>

                        <div className={styles.cardContainer}>
                            {cards.map(card => (
                                <GameCard
                                    card={card}
                                    width={220}
                                    className={styles.card}
                                />
                            ))}
                        </div>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('sections.goodPracticeCards.title')}</p>
                            <p className={styles.rulesTextContent}>{t('sections.goodPracticeCards.description')}</p>
                        </div>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('sections.badPracticeCards.title')}</p>
                            <p className={styles.rulesTextContent}>{t('sections.badPracticeCards.description')}</p>
                        </div>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('sections.trainingCards.title')}</p>
                            <p className={styles.rulesTextContent}>{t('sections.trainingCards.description')}</p>
                        </div>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('sections.discardCard.title')}</p>
                            <p className={styles.rulesTextContent}>{t('sections.discardCard.description')}</p>
                        </div>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('sections.awarenessPoints.title')}</p>
                            <p className={styles.rulesTextContent}>{t('sections.awarenessPoints.description')}</p>
                        </div>

                        <div className={styles.rulesText}>
                            <p className={styles.rulesTextTitle}>{t('sections.expertCards.title')}</p>
                            <p className={styles.rulesTextContent}>{t('sections.expertCards.description')}</p>
                        </div>

                    </div>
                </div>
            </div>
            <BackgroundImg />
        </div>
    );
}

export default Rules;