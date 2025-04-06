import { Card } from '@shared/common/Cards';
import styles from './flipCard.module.css';
import GameCard from '../gameCard/GameCard';
import BackCard from '../backCard/backCard';

export interface FlipCardProps {
    width?: number | '100%';
    card: Card;
    flipped?: boolean; 
    className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ 
    width = '100%',
    card,
    flipped = false,
    className = '',
}) => {

    return (
        <div className={`${styles.cardContainer} ${!flipped ? styles.flipped : ''} ${className}`} style={{ width }}>
            <div className={styles.cardInner}>
                <GameCard
                    width={width}
                    card={card}
                    className={styles.cardFront}
                />

                <BackCard
                    width={width}
                    className={styles.cardBack}
                />
            </div>
        </div>
    );
}

export default FlipCard;