import React, { useState, useEffect } from 'react';
import Header from "@app/js/components/header/Header";
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import FormationCard from "@app/js/components/FormationCard/FormationCard";
import ExpertCard from "@app/js/components/ExpertCard/ExpertCard";
import PracticeQuestion from "@app/js/components/PracticeQuestion/PracticeQuestion";
import next from '@app/icons/next.webp';
import { useNavigate } from 'react-router-dom';
import closeIcon from '@app/icons/close.webp';
import image from '../../../icons/background-image.jpg';
import arrowBack from '../../../icons/arrowBack.png';
import styles from './viewCards.module.css';
import { Difficulty } from '@shared/common/Cards';

function ViewCards() {
    const [cards, setCards] = useState([]);
    const [startCardIndex, setStartCardIndex] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuestionnaireBPOpen, setIsQuestionnaireBPOpen] = useState(false);

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
                    throw new Error('Failed to fetch card info');
                }
                const allCards = await response.json();
                setCards(allCards);
            } catch (error) {
                console.error('Error fetching card info:', error.message);
                throw error;
            }
        }
        fetchData();
    }, []);

    const nextPage = () => {
        if (startCardIndex + 14 < cards.length) {
            setStartCardIndex(startCardIndex + 14);
        }
    };

    const previousPage = () => {
        if (startCardIndex - 14 >= 0) {
            setStartCardIndex(startCardIndex - 14);
        }
    };

    const isNextDisabled = startCardIndex + 14 >= cards.length;
    const isPreviousDisabled = startCardIndex === 0;

    const openModal = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
        setIsQuestionnaireBPOpen(card.cardType === 'BestPractice' || card.cardType === 'BadPractice');
    };

    const closeModal = () => {
        setSelectedCard(null);
        setIsModalOpen(false);
        setIsQuestionnaireBPOpen(false);

    };

    return (
        <div className={styles.viewCardsPage}>
            <Header />
            <div className={styles.viewCardsContainer}>
                <div className={styles.containerHeader}>
                    <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/menu')}>
                        <img src={arrowBack} />
                        <span>Retour</span>
                    </div>
                    <h2>Visualisation des cartes</h2>
                </div>
                <div className={styles.cardsContainer}>
                    {cards.slice(startCardIndex, startCardIndex + 14).map((card, index) => (
                        <div key={index} className={styles.card} onClick={() => openModal(card)}>
                            {card.cardType === 'BestPractice' && <BestPracticeCard id={card.id} title={card.title} contents={card.contents} carbon_loss={card.carbon_loss} cardType={'BestPractice'} network_gain={false} memory_gain={false} cpu_gain={false} storage_gain={false} difficulty={Difficulty.ONE} actor={'Architect'} />}
                            {card.cardType === 'BadPractice' && <BadPracticeCard title={card.title} contents={card.contents} actor={card.actor} cardType={'BadPractice'} network_gain={false} memory_gain={false} cpu_gain={false} storage_gain={false} difficulty={Difficulty.ONE} id={''} />}
                            {card.cardType === 'Formation' && <FormationCard title={card.title} contents={card.contents} actor={card.actor} cardType={'Formation'} linkToFormation={''} id={''} />}
                            {card.cardType === 'Expert' && <ExpertCard title={card.title} contents={card.contents} actor={card.actor} cardType={'Expert'} id={''} />}
                        </div>
                    ))}
                </div>
                <div className={styles.navigationButtons}>
                    <img src={next} alt="Previous" className={`${styles.prevButton} ${isPreviousDisabled ? styles.disabled : ''}`} onClick={previousPage} />
                    <img src={next} alt="Next" className={`${styles.nextButton} ${isNextDisabled ? styles.disabled : ''}`} onClick={nextPage} />
                </div>
            </div>
            {isModalOpen && (
                <div className={styles.modalBackdrop}>
                    <div className={`${styles.modalContent}`}>
                        <div className={styles.closeButton} onClick={closeModal}>
                            <img src={closeIcon} alt="Close" />
                        </div>
                        {selectedCard && (
                            <div>
                                {isQuestionnaireBPOpen && (
                                    <PracticeQuestion card={selectedCard} />
                                )}
                                {(selectedCard.cardType === 'Formation' || selectedCard.cardType === 'Expert') && (
                                    <div className={`${styles.bigCard}`}>
                                        {selectedCard.cardType === 'Formation' && (
                                            <FormationCard title={selectedCard.title} contents={selectedCard.contents} actor={selectedCard.actor} cardType={'Formation'} linkToFormation={''} id={''} />
                                        )}
                                        {selectedCard.cardType === 'Expert' && (
                                            <ExpertCard title={selectedCard.title} contents={selectedCard.contents} actor={selectedCard.actor} cardType={'Expert'} id={''} />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <img src={image} alt="Image de la tonne de bonnes pratiques" className={styles.bgImage} />
        </div>
    );
}

export default ViewCards;
