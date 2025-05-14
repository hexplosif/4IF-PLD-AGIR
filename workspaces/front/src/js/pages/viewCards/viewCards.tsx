import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from "@app/js/components/header/Header";
import PracticeQuestion from "@app/js/components/game/quizz/PracticeQuestion/PracticeQuestion";
import { useNavigate } from 'react-router-dom';
import closeIcon from '@app/assets/icons/close.webp';
import arrowBack from '@app/assets/icons/arrowBack.png';
import styles from './viewCards.module.css';
import BackgroundImg from '@app/js/components/BackgroundImage/BackgroundImg';
import { GameCard, ModalCard } from '@app/components/card';

function ViewCards() {
    const { t, i18n } = useTranslation('viewCards');
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    }, [t]);

    const openModal = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
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
                    <h2>{t('page_title')}</h2>
                </div>
                <div className={styles.cardsContainer}>
                    {cards.map((card) => (
                        <div onClick={() => openModal(card)} className={styles.cardWrapper}>
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