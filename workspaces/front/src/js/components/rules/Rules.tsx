import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RulesPage1.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import FormationCard from "@app/js/components/FormationCard/FormationCard";
import ExpertCard from "@app/js/components/ExpertCard/ExpertCard";
import { Actor, Difficulty } from '@shared/common/Cards';
import { GameCard } from '@app/components/card';
import { se } from 'date-fns/locale';

const RulesPage1: React.FC = () => {

    const [cards, setCards] = useState([]);
    const { t, i18n } = useTranslation('rules', { keyPrefix: 'page1' });

    const [selectedBestPractice, setSelectedBestPractice] = useState(false);
    const [selectedBadPractice, setSelectedBadPractice] = useState(false);
    const [selectedFormation, setSelectedFormation] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState(false);

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
                console.log(allCards);
                setCards(allCards);
            } catch (error) {
                console.error('Error fetching card info:', error.message);
                throw error;
            }
        }
        fetchData();
    }, [t]);

    return (
        <div className={styles.container}>
            <div className={styles.section1}>
                <p>
                    <strong>{t('participants')}</strong><br /><br />
                    <strong>{t('gameObjective')}</strong><br /><br />
                    <strong>{t('gamePreparation.title')}</strong><br />
                    - {t('gamePreparation.steps.0')}<br />
                    - {t('gamePreparation.steps.1')}
                </p>
            </div>
            <div className={styles.section2}>
                <p>
                    <strong>{t('turnSequence.title')}</strong>
                    {t('turnSequence.description')}<br /><br />
                    {t('turnSequence.playerActions')}
                </p>
                <div className={styles.cardContainer}>
                    {cards.map((card) => (
                        <div className={styles.card}>
                            {card.cardType === 'BestPractice' && selectedBestPractice === false && (
                                setSelectedBestPractice(true),
                                <GameCard
                                    width={430}
                                    card={card}
                                />
                            )}
                            {card.cardType === 'BadPractice' && selectedBadPractice === false && (
                                setSelectedBadPractice(true),
                                <GameCard
                                    width={330}
                                    card={card}
                                />
                            )}
                            {card.cardType === 'Formation' && selectedFormation === false && (
                                setSelectedFormation(true),
                                <GameCard
                                    width={330}
                                    card={card}
                                />
                            )}
                            {card.cardType === 'Expert' && selectedExpert === false && (
                                setSelectedExpert(true),
                                <GameCard
                                    width={330}
                                    card={card}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RulesPage1;