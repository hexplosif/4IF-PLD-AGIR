import { PlayerStateInterface } from "@shared/common/Game";
import styles from './PlayerTable.module.css';
import { CardDeck, DiscardArea, PlayerHand } from "../../card";
import { Card } from "@shared/common/Cards";

const cardWidth = 110;

interface PlayerTableProps {
    playerState: PlayerStateInterface;
    isTurnPlayer?: boolean;
    nbPlayerNotBlocked: number;
}

const PlayerTable: React.FC<PlayerTableProps> = ({ 
    playerState, 
    isTurnPlayer = false,
    nbPlayerNotBlocked,
}) => {

    const getCanPlayOfCard = (card: Card) => {
        switch (card.cardType) {
            case "BestPractice":
                return true;
            case "BadPractice":
                return nbPlayerNotBlocked > 0;
            case "Expert":
                return true;
            case "Formation":
                return playerState.badPractice === card.actor;
            default:
                return false;
        }
    }

    return (
        <div className={`${styles.playerTable}`}>
            <DiscardArea
                width={cardWidth}
                className={styles.discardArea}
            />

            <PlayerHand
                cards={playerState.cardsInHand.map((card) => ({
                    card: card,
                    canPlay: getCanPlayOfCard(card), // TODO: Replace with actual logic
                }))}
                isTurnPlayer={isTurnPlayer}
                className={styles.playerHand}
                cardWidth={cardWidth}
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