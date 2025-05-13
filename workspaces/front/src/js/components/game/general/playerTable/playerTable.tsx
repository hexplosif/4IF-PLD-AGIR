import { PlayerStateInterface } from "@shared/common/Game";
import styles from './PlayerTable.module.css';
import { CardDeck, DiscardArea, PlayerHand } from "../../card";
import { Card } from "@shared/common/Cards";
import { useEffect } from "react";

const cardWidth = 110;

interface PlayerTableProps {
    playerState: PlayerStateInterface;
    isTurnPlayer?: boolean;
    nbOtherPlayersNotBlocked: number;
    onDiscardCard?: (card: Card) => void;
    gameName?: string;
}

const PlayerTable: React.FC<PlayerTableProps> = ({ 
    playerState, 
    isTurnPlayer = false,
    nbOtherPlayersNotBlocked,
    onDiscardCard,
    gameName = 'Game',
}) => {

    const getCanPlayOfCard = (card: Card) => {
        switch (card.cardType) {
            case "BestPractice":
                if (playerState.badPractice) return {canPlay: false, cause: `You are blocked by ${playerState.badPractice}`};
                return {canPlay: true, cause: ''};
            case "BadPractice":
                if (nbOtherPlayersNotBlocked > 0) return {canPlay: true, cause: ''};
                return {canPlay: false, cause: `No one left to play this card!`};
            case "Expert":
                return {canPlay: true, cause: ''};
            case "Formation":
                if (playerState.badPractice === card.actor) return {canPlay: true, cause: ''};
                return {canPlay: false, cause: `This card is only for removing bad practice type ${card.actor}!`};
            default:
                return {canPlay: false, cause: `This card cannot be played!`};
        }
    }

    return (
        <div className={`${styles.playerTable}`}>
            <DiscardArea
                width={cardWidth}
                className={styles.discardArea}
                onCardDiscarded={onDiscardCard}
            />

            <PlayerHand
                cards={playerState.cardsInHand.map((card) => ({
                    card: card,
                    ...getCanPlayOfCard(card), // TODO: Replace with actual logic
                }))}
                isTurnPlayer={isTurnPlayer}
                className={styles.playerHand}
                cardWidth={cardWidth}
                badPracticeApplied={playerState.badPractice}
                gameName={gameName}
            />

            <CardDeck
                flip={true}
                cards={playerState.cardsHistory}
                widthCard={cardWidth * 1.05}
                className={styles.historyDeck}
                placeholder="History Deck"
                dataTooltip="Your lasts played cards will be here."
            />
        </div>
    )
};

export default PlayerTable;