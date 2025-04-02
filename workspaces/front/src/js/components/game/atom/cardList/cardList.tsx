import styles from './cardList.module.css';

interface CardListProps {
    cardElements: React.ReactNode[];
    cardWidth: number;
    isCurve?: boolean;
    overlapFactor?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
}

const maxCardRotation = 5;
const maxHandFanAngle = 60;
const handCurveAmount = 25;

const rotationDirection = {
    left: 90,
    right: -90,
    up: 0,
    down: 180,
}

const CardList: React.FC<CardListProps> = ({
    cardElements,
    isCurve = false,
    cardWidth,
    overlapFactor = 0.6,
    className = '',
    direction = 'down',
}) => {
    const nbCards = cardElements.length;
    const renderCardsInHand = () => cardElements.map((element, index) => {

		// --- Calculate position and rotation for fan effect ---
		let rotationAngle = 0;
		const actualFanAngle = Math.min(nbCards * maxCardRotation * 2, maxHandFanAngle);
		if (nbCards > 1) {
		  const rotationRatio = (index / (nbCards - 1)) - 0.5;
		  rotationAngle = rotationRatio * actualFanAngle;
		}

		const cardSpacing = cardWidth * (1 - overlapFactor);
		const totalCardsWidth = (nbCards - 1) * cardSpacing; 
		const handStartX = `calc(50% - ${cardWidth / 2}px - ${totalCardsWidth / 2}px)`;
		const leftPosition = `calc(${handStartX} + ${index * cardSpacing}px)`;

		let verticalOffset = 0;
		if (nbCards > 1) {
			const curveRatio = Math.abs((index / (nbCards - 1)) - 0.5) * 2; 
			verticalOffset = handCurveAmount * (1 - curveRatio * curveRatio);
		}

		const cardStyle: React.CSSProperties = {
			left: leftPosition,
			zIndex: index,
            transform: isCurve ? `translateY(${-verticalOffset}px) rotate(${rotationAngle}deg)` : ``,
		};

		return (
			<div key={index} className={styles.cardWrapper} style={cardStyle}>
				{element}
			</div>
		)}
	);

    const rotationStyle : React.CSSProperties = {
        transformOrigin: 'center center',
        transform: `rotate(${rotationDirection[direction]}deg)`,
    };

    return (
        <div className={`${styles.cardsInHandContainer} ${className} `} style={rotationStyle}>
            {renderCardsInHand()}
        </div>
    );
};

export default CardList;