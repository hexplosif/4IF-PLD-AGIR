import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from "@app/js/components/header/Header";
import arrowBack from '@app/assets/icons/arrowBack.png';
import profil from '@app/assets/icons/profil.png';
import insa from '@app/assets/icons/insalyon.webp';
import cgi from '@app/assets/icons/cgi.png';
import styles from './credits.module.css';
import BackgroundImg from '@app/js/components/BackgroundImage/BackgroundImg';

function Credits() {
  const navigate = useNavigate();
  const { t } = useTranslation('credits');

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
            <span>{t('header.return')}</span>
          </div>
          <h2>{t('title')}</h2>
        </div>

        <div className={styles.initiativeTextContainer}>
          <h2>{t('initiative.title')}</h2>
          <img src={cgi} alt="CGI" />
        </div>

        <div className={styles.titreEquipe}>
          <h3>{t('teams.insa1.title')}</h3>
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
          <h3>{t('teams.insa2.title')}</h3>
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
          <h3>{t('teams.cgi.title')}</h3>
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
      <BackgroundImg/>
    </div>
  );
}

export default Credits;