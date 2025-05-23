import arrowBack from '@app/assets/icons/arrowBack.png';
import { GameCard, ModalCard } from '@app/components/card';
import BackgroundImg from '@app/js/components/BackgroundImage/BackgroundImg';
import Header from "@app/js/components/header/Header";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './viewCards.module.css';

function ViewCards() {
    const { t, i18n } = useTranslation('viewCards');
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

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
                        'Accept-Language': i18n.language,
                    },
                });
                if (!response.ok) {
                    throw new Error(t('errors.fetch_cards'));
                }
                const allCards = await response.json();
                setCards(allCards);
            } catch (error) {
                console.error('Error fetching card info:', error.message);
                throw error;
            }
        }
        fetchData();
    }, [t, i18n.language]);

    const openModal = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const filterCards = () => {
        if (activeFilter === 'all') {
            return cards;
        }
        return cards.filter(card => card.cardType === activeFilter);
    };

    const cardCounts = {
        all: cards.length,
        BestPractice: cards.filter(card => card.cardType === 'BestPractice').length,
        BadPractice: cards.filter(card => card.cardType === 'BadPractice').length,
        Formation: cards.filter(card => card.cardType === 'Formation').length,
        Expert: cards.filter(card => card.cardType === 'Expert').length
    };

    return (
        <div className={styles.viewCardsPage}>
            <Header />
            <div className={styles.viewCardsContainer}>
                <div className={styles.containerHeader}>
                    <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/menu')}>
                        <img src={arrowBack} alt={t('return_button')} />
                        <span>{t('return_button')}</span>
                    </div>
                    <div className={styles.titleFilterContainer}>
                       
                        <h2>{t('page_title')}</h2>
                        <div className={styles.filterContainer}>
                            <button
                                className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                {t('filters.all')} ({cardCounts.all})
                            </button>
                            <button
                                className={`${styles.filterButton} ${activeFilter === 'BestPractice' ? styles.active : ''}`}
                                onClick={() => setActiveFilter('BestPractice')}
                            >
                                {t('filters.good_practices')} ({cardCounts.BestPractice})
                            </button>
                            <button
                                className={`${styles.filterButton} ${activeFilter === 'BadPractice' ? styles.active : ''}`}
                                onClick={() => setActiveFilter('BadPractice')}
                            >
                                {t('filters.bad_practices')} ({cardCounts.BadPractice})
                            </button>
                            <button
                                className={`${styles.filterButton} ${activeFilter === 'Formation' ? styles.active : ''}`}
                                onClick={() => setActiveFilter('Formation')}
                            >
                                {t('filters.formation')} ({cardCounts.Formation})
                            </button>
                            <button
                                className={`${styles.filterButton} ${activeFilter === 'Expert' ? styles.active : ''}`}
                                onClick={() => setActiveFilter('Expert')}
                            >
                                {t('filters.expert')} ({cardCounts.Expert})
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.cardsContainer}>
                    {filterCards().map((card) => (
                        <div key={card.id} onClick={() => openModal(card)} className={styles.cardWrapper}>
                            <GameCard
                                width={330}
                                card={card}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <ModalCard card={selectedCard} isVisible={isModalOpen} 
                onClose={()=>{
                    setIsModalOpen(false);
                    setSelectedCard(null);
                }}
            />
            <BackgroundImg />
        </div>
    );
}

export default ViewCards;