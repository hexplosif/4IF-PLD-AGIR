// BackCard.tsx
import React from 'react';
import styles from './BackCard.module.css';
import logo from '@app/assets/images/1_tonne_de_bonnes_pratiques.avif';

interface BackCardProps {
    width: number | '100%';
    className?: string;
}

const BackCard: React.FC<BackCardProps> = ({ width, className="" }) => {
    const cardStyle = {
        width: typeof width === 'number' ? `${width}px` : width,
    };

    return (
        <div className={`${styles.cardContainer} ${className}`}>
            <div className={styles.cardInside} style={cardStyle}>
                <div className={styles.patternOverlay}></div>
                <img src={logo} className={styles.logo}/>
            </div>
        </div>

  );
};

export default BackCard;