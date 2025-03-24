import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@app/js/components/header/Header";
import image from '@app/assets/icons/background-image.jpg';
import arrowBack from '@app/assets/icons/arrowBack.png';
import profil from '@app/assets/icons/profil.png';
import insa from '@app/assets/icons/insalyon.webp';
import cgi from '@app/assets/icons/cgi.png';
import styles from './credits.module.css';


function Credits() {

  const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.creditsPage}>
      <Header />
      <div className={styles.creditsContainer}>
        <div className={styles.containerHeader}>
          <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/menu')}>
            <img src={arrowBack} />
            <span>Retour</span>
          </div>
          <h2>Crédits</h2>
        </div>

        <div className={styles.titreEquipe}>
          <h3>Équipe INSA 1 (Avril-Mai 2024) : </h3>
          <img src={insa} alt="INSA Lyon" />
        </div>

        <div className={styles.membresEquipe}>
          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Chantrel Thibaud</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Pignol Sarah</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Pigeonnat Meije</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Muller Grégoire</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Le Roux Jade</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Delcourt Lou</span>
          </div>
        </div>

        <div className={styles.titreEquipe}>
          <h3>Équipe INSA 2 (Mars-Avril 2025) : </h3>
          <img src={insa} alt="INSA Lyon" />
        </div>

        <div className={styles.membresEquipe}>
          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Schlee Adam</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Fakroni Mohamed</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Sun Jixiang</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Thi Tho Vu</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Huu Thanh Tu Huynh</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Truong Son Ngo</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Charlotte Matéo</span>
          </div>
        </div>

        <div className={styles.titreEquipe}>
          <h3>Équipe CGI : </h3>
          <img src={cgi} alt="CGI" />
        </div>

        <div className={styles.membresEquipe}>
          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Scheppler Alexandre</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Cognet Julien</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Lucas Clément</span>
          </div>

          <div className={styles.membre}>
            <img src={profil} alt="o" />
            <span>Bocandé Yvan</span>
          </div>
        </div>
        
      </div>
      <img src={image} alt="Image de la tonne de bonnes pratiques" className={styles.bgImage} />
    </div>
  );
}

export default Credits;