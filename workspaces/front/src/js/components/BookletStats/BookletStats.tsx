import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookletStats.module.css';

const BookletStats: React.FC = () => {

    const [nb_played, setNb_played] = useState<number>();
    const [nb_win, setNb_win] = useState<number>();
    const [percent_win, setPercent_win] = useState<number>();
    const [total_CO2, setTotal_CO2] = useState<number>();
    const [nb_BP, setNb_BP] = useState<number>();
    const [nb_MP, setNb_MP] = useState<number>();

    useEffect(() => {
        async function fetchData() {
            console.log("------------useEffect Stats--------");
            const token = localStorage.getItem('token');
            if (!token || token === 'undefined') {
                console.error('No token found in local storage');
                return;
            }
            try {
                console.log('token in booklet:', token);
                //get pour retrouver le nombre de parties jouées par l'utilisateur
                const responsePlayed = await fetch(`${import.meta.env.VITE_API_URL}/users/nbGames?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!responsePlayed.ok) {
                    throw new Error('Failed to fetch number of games played');
                }
                const { nb_games } = await responsePlayed.json();
                console.log(responsePlayed);
                setNb_played(nb_games);

                //Get Victory count
                const responseWin = await fetch(`${import.meta.env.VITE_API_URL}/users/nbVictories?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!responseWin.ok) {
                    throw new Error('Failed to fetch number of victories');
                }
                const { nb_victories } = await responseWin.json();
                setNb_win(nb_victories);

                // Calcul du pourcentage de victoires
                if (nb_victories !== null && nb_games !== null && nb_games !== 0) {
                    const winPercentage = (nb_victories / nb_games) * 100;
                    setPercent_win(winPercentage);
                } else {
                    setPercent_win(0);
                }

                //get pour retrouver le total de CO2 sauvé par l'utilisateur
                const responseCO2 = await fetch(`${import.meta.env.VITE_API_URL}/users/totalCO2Saved?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!responseCO2.ok) {
                    throw new Error('Failed to fetch total CO2 saved');
                }

                const { total_co2_saved } = await responseCO2.json();
                setTotal_CO2(total_co2_saved);

                //get pour retrouver le nombre de bonnes pratiques archivées par l'utilisateur
                const nbBonnePratique = await fetch (`${import.meta.env.VITE_API_URL}/users/nbGreenITPractices?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!nbBonnePratique.ok) {
                    throw new Error('Failed to fetch number of good practices');
                }

                const { nb_green_it_practices : nb_BP } = await nbBonnePratique.json();
                setNb_BP(nb_BP);

                //get pour retrouver le nombre de mauvaises pratiques archivées par l'utilisateur
                const nbMauvaisePratique = await fetch (`${import.meta.env.VITE_API_URL}/users/nbMauvaisePratice?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!nbMauvaisePratique.ok) {
                    throw new Error('Failed to fetch number of bad practices');
                }
                const { nb_mauvaise_pratice : nb_MP } = await nbMauvaisePratique.json();
                setNb_MP(nb_MP);
                
            } catch (error) {
                console.error('Error fetching info:', error.message);
            }
        }
        fetchData();
    }, []);

    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <label className={styles.label}><strong>Statistiques du jeu</strong></label><br />
            <div>
                Nombre de parties jouées : <span className={styles.value}>
                    {nb_played !== null && nb_played !== undefined ? nb_played : <i> (Erreur)</i>}
                </span><br /><br />
                Nombre de victoires : <span className={styles.value}>
                    {nb_win !== null && nb_win !== undefined ? `${nb_win} (${percent_win?.toFixed(2)}%)` : <i> (Erreur)</i>}
                </span><br /><br />
                Total de CO2 économisé : <span className={styles.value}>
                    {total_CO2 !== null && total_CO2 !== undefined ? `${total_CO2} T` : <i> (Erreur)</i>}
                </span><br /><br />
                Nombre de bonnes pratiques archivées dans le carnet : <span className={styles.value}>
                    {nb_BP !== null && nb_BP !== undefined ? nb_BP : <i> (Erreur)</i>}
                </span><br /><br />
                Nombre de mauvaises pratiques archivées dans le carnet : <span className={styles.value}>
                    {nb_MP !== null && nb_MP !== undefined ? nb_MP : <i> (Erreur)</i>}
                </span><br /><br />
            </div>
        </div>
    );
};

export default React.memo(BookletStats);
