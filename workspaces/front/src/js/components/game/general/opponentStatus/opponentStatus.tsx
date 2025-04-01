import React, { useRef, useState, useEffect } from 'react';
import { FaLeaf, FaSkull } from 'react-icons/fa';
import { IoEarth } from 'react-icons/io5';
import styles from './OpponentStatus.module.css';
import { BackCard } from '@app/components/card';
import { Actor } from '@shared/common/Cards';
import ExpertsActivated from '../../atom/expertsActivated/expertsActivated';
import CardList from '../../atom/cardList/cardList';
import { PlayerStateInterface } from '@shared/common/Game';
import { ItemTypes } from '@app/js/types/DnD';
import { useDrop } from 'react-dnd';

interface OpponentStatusProps {
	playerState: PlayerStateInterface;
	isTurnPlayer: boolean;
	position: 'left' | 'top' | 'right';
	className?: string;
	onDropBadPracticeCard: (card: any) => void;
}

const OpponentStatus: React.FC<OpponentStatusProps> = ({
	className = '',
	playerState,
	isTurnPlayer,
	position,
	onDropBadPracticeCard,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [dropAnimation, setDropAnimation] = useState(false);
	const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });
	
	const [{ isOver, canDrop }, dropRef] = useDrop({
		accept: ItemTypes.CARD,
		drop: (item: any, monitor) => {
			onDropBadPracticeCard?.(item.card);
			
			// Get drop position for animation
			const dropOffset = monitor.getClientOffset();
			if (dropOffset && ref.current) {
				const rect = ref.current.getBoundingClientRect();
				setDropPosition({
					x: dropOffset.x - rect.left,
					y: dropOffset.y - rect.top
				});
				
				// Trigger drop animation
				setDropAnimation(true);
			}
		},
		canDrop: (item: any) => {
			if (item.card.cardType !== "BadPractice")
				return false;
			return !playerState.badPractice;
		},
		collect: (monitor) => ({
			canDrop: monitor.canDrop(),
			isOver: monitor.isOver(),
		}),
	});
	
	// Reset drop animation after it completes
	useEffect(() => {
		if (dropAnimation) {
			const timer = setTimeout(() => {
				setDropAnimation(false);
			}, 800);
			
			return () => clearTimeout(timer);
		}
	}, [dropAnimation]);
	
	dropRef(ref);

	// Check if the component should be rendered vertically
	const isVertical = position === 'left' || position === 'right';

	const expertsActivated = {
		[Actor.ARCHITECT]: playerState.expertCards.includes(Actor.ARCHITECT),
		[Actor.DEVELOPER]: playerState.expertCards.includes(Actor.DEVELOPER),
		[Actor.PRODUCT_OWNER]: playerState.expertCards.includes(Actor.PRODUCT_OWNER),
	}; 
	
	// Function to render the tokens as leaves
	const renderTokens = () => {
		const tokens = [];
		const maxTokens = 5;
		
		for (let i = 0; i < maxTokens; i++) {
			tokens.push(
				<div key={i} className={`${styles.tokenLeaf} ${i < playerState.sensibilisationPoints ? styles.activeToken : ''}`} >
					<FaLeaf />
					{i < playerState.sensibilisationPoints && <div className={styles.tokenGlow} />}
				</div>
			);
		}
		
		return tokens;
	};

	const renderPlayerInfo = () => {
		return (
			<div className={styles.playerSection}>
				<div className={styles.avatarContainer}>
					<div className={styles.playerAvatar}>
						{playerState.playerName?.charAt(0)?.toUpperCase() || '?'}
					</div>
				</div>

				<div className={styles.playerInfo}>
					<div className={styles.playerName}>{playerState.playerName || 'Opponent'}</div>
					<div className={styles.playerScore}>
						<IoEarth className={styles.scoreIcon} />
						<span>{playerState.co2Saved.toLocaleString()}</span>
						<span className={styles.scoreUnit}>kg CO₂</span>
					</div>
				</div>
			</div>
		)
	}

	// Set the container classes based on position, turn status, and drag state
	const containerClasses = [
		styles.opponentStatus,
		styles[position],
		isVertical ? styles.vertical : styles.horizontal,
		isOver && canDrop ? styles.canDropOver : '',
		isOver && !canDrop ? styles.cannotDropOver : '',
		!isOver && canDrop ? styles.canDrop : '',
		className
	].join(' ');

	// Render differently based on position
	return (
		<div className={containerClasses} ref={ref}>
			{/* Target indicator for drag and drop */}
			{(isOver || canDrop) && (
				<div className={`${styles.targetIndicator} ${isOver ? styles.targetActive : ''}`}>
					{canDrop ? (
						<div className={styles.attackTargetContainer}>
							<div className={styles.attackTarget}></div>
							<div className={styles.attackTargetPulse}></div>
						</div>
					) : (
						<div className={styles.noAttackAllowed}>
							<FaSkull />
						</div>
					)}
				</div>
			)}
			
			{/* Animated tooltip */}
			{isOver && (
				<div className={styles.dropTooltip}>
					{canDrop ? 'Attack with Bad Practice' : 'Cannot Attack This Player With This Card'}
				</div>
			)}
			
			{/* Drop animation */}
			{dropAnimation && (
				<>
					<div 
						className={styles.cardDropShadow} 
						style={{
							left: `${dropPosition.x}px`,
							top: `${dropPosition.y}px`
						}}
					/>
					<div 
						className={styles.attackImpact}
						style={{
							left: `${dropPosition.x}px`,
							top: `${dropPosition.y}px`
						}}
					/>
				</>
			)}
			
			<div className={`${styles.mainContainer} ${isTurnPlayer ? styles.activePlayer : styles.inactivePlayer}`}>
				<div className={styles.contentWrapper}>

					{/* Left column with player info */}
					<div className={styles.infoColumn}>
						{/* Player Info Section */}
						{renderPlayerInfo()}

						{/* Power Tokens */}
						<div className={styles.tokenDisplay}>
							{renderTokens()}
						</div>
						
						{/* Immune Types */}
						<ExpertsActivated 
							expertsActivated={expertsActivated}
							backgroundColor='rgba(0, 0, 0, 0.15)'
						/>

					</div>
					
					{/* Right column with card decks */}
					<div className={styles.cardDecksContainer}>
							
							<div className={styles.cardDeckPlaceholder}>
								<div className={styles.emptyDeckIndicator}>
									<span className={styles.emptyDeckIndicatorLabel}>Active</span>
								</div>
							</div>
						
							<div className={styles.cardDeckPlaceholder}>
								<div className={styles.emptyDeckIndicator}>
									<span className={styles.emptyDeckIndicatorLabel}>Played</span>
								</div>
							</div>

					</div>
				</div>
			</div>

			{/* Bad Practice indicator if opponent has one */}
			{playerState.badPractice && (
				<div className={styles.badPracticeIndicator}>
					<div className={styles.badPracticeIcon}>
						<FaSkull />
					</div>
				</div>
			)}

			{/* Cards in hand */}
			<CardList 
				cardElements={Array.from({ length: playerState.cardsInHand.length }, (_, index) => (
					<BackCard key={index} width={80}/>
				))}
				cardWidth={80}
				isCurve={true}
				className={styles.cardsInHandContainer}
				direction={position === 'top' ? 'down' : position}
			/>
		</div>
	);
}

export default OpponentStatus;