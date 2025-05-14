import React, { useEffect, useState } from 'react';
import { FaLeaf, FaInfoCircle } from 'react-icons/fa';
import { IoEarth } from 'react-icons/io5';
import styles from './GameHeader.module.css';
import { Actor } from '@shared/common/Cards';
import ExpertsActivated from '../../atom/expertsActivated/expertsActivated';
import { PlayerStateInterface } from '@shared/common/Game';


interface GameHeaderProps {
	className?: string;
	maxScore?: number;
	playerState: PlayerStateInterface;
}

const GameHeader: React.FC<GameHeaderProps> = ({
	className = '',
	maxScore = 1000,
	playerState,
}) => {
	const expertsActivated = {
		[Actor.ARCHITECT]: playerState.expertCards.includes(Actor.ARCHITECT),
		[Actor.DEVELOPER]: playerState.expertCards.includes(Actor.DEVELOPER),
		[Actor.PRODUCT_OWNER]: playerState.expertCards.includes(Actor.PRODUCT_OWNER),
	};

	const [animateScore, setAnimateScore] = useState(false);
	const [prevScore, setPrevScore] = useState(playerState.co2Saved);
	const progressPercentage = Math.min((playerState.co2Saved / maxScore) * 100, 100);

	// Animate score when it changes
	useEffect(() => {
		if (playerState.co2Saved !== prevScore) {
			setAnimateScore(true);
			const timer = setTimeout(() => setAnimateScore(false), 1000);
			setPrevScore(playerState.co2Saved);

			return () => clearTimeout(timer);
		}
	}, [playerState.co2Saved]);

	// Function to render the tokens as leaves with animation
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

	return (
		<div className={`${styles.gameHeader} ${className}`}>
			<div className={styles.headerContent}>
				<div className={styles.playerSection}>
					<div className={styles.avatarContainer}>
						<div className={styles.playerAvatar}>
							{playerState.playerName?.charAt(0)?.toUpperCase() || '?'}
						</div>
					</div>

					<div className={styles.playerInfo}>
						<div className={styles.nameScoreRow}>
							<div className={styles.playerName}>{playerState.playerName || 'Player'}</div>
						</div>

						<div className={`${styles.playerScore} ${animateScore ? styles.scoreAnimation : ''}`}>
							<IoEarth className={styles.scoreIcon} />
							<span>{playerState.co2Saved.toLocaleString()}</span>
							<span className={styles.scoreUnit}>/ {maxScore} kg CO₂</span>
						</div>

						<div className={styles.progressContainer}>

							<div
								className={styles.progressBar}
								style={{ width: `${progressPercentage}%` }}
							/>
							<div className={styles.progressMarkers}>
								<div className={styles.progressMarker} style={{ left: '25%' }}></div>
								<div className={styles.progressMarker} style={{ left: '50%' }}></div>
								<div className={styles.progressMarker} style={{ left: '75%' }}></div>
							</div>
						</div>
					</div>
				</div>

				<div className={styles.tokensAndImmuneSection}>
					<div className={styles.tokenSection}>
						<div className={styles.tokenContainer}>
							<div className={styles.tokenHeader}>
								<span>Sensibilisation Points</span>
								<FaInfoCircle className={styles.infoIcon} title="Use tokens to activate special abilities" />
							</div>
							<div className={styles.tokenDisplay}>
								{renderTokens()}
							</div>
						</div>
					</div>

					<div className={styles.immuneSection}>
						<div className={styles.immuneContainer}>
							<div className={styles.immuneHeader}>
								<span>Experts</span>
								<FaInfoCircle className={styles.infoIcon} title="Immunities protect you from certain game hazards" />
							</div>
							<ExpertsActivated
								sizeIcon={60}
								expertsActivated={expertsActivated}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameHeader;