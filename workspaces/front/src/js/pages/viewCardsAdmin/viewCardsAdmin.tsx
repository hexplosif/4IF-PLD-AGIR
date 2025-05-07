import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from "@app/js/components/header/Header";
import { useNavigate } from 'react-router-dom';
import arrowBack from '@app/assets/icons/arrowBack.png';
import styles from './viewCardsAdmin.module.css';
import BackgroundImg from '@app/js/components/BackgroundImage/BackgroundImg';
import { GameCard } from '@app/components/card';
import { FiPlus } from 'react-icons/fi';

function ViewCardsAdmin() {
    const { t, i18n } = useTranslation('viewCards');
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();

    const redirectToPage = (path: string) => {
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

    const handleCardClick = (card) => {
        navigate(`/admin/card?id=${card.id}`);
    };

    const handleCreateCardClick = () => {
        navigate('/admin/card');
    };

    return (
        <div className={styles.viewCardsPage}>
            <Header />
            <BackgroundImg />
            <div className={styles.viewCardsContainer}>
                <div className={styles.containerHeader}>
                    <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/admin')}>
                        <img src={arrowBack} alt={t('return_button')} />
                        <span>{t('return_button')}</span>
                    </div>
                    <h2>Admin Cards Management</h2>
                    <button 
                        className={styles.createCardButton}
                        onClick={handleCreateCardClick}
                    >
                        <FiPlus /> Create Card
                    </button>
                </div>
                <div className={styles.cardsContainer}>
                    {cards.map((card) => (
                        <div 
                            key={card.id}
                            onClick={() => handleCardClick(card)} 
                            className={styles.cardWrapper}
                        >
                            <GameCard
                                width={"100%"}
                                card={card}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ViewCardsAdmin;