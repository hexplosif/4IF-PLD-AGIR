import { PlayerStateInterface } from "@shared/common/Game";
import styles from './PlayerTable.module.css';
import { CardDeck, DiscardArea, PlayerHand } from "../../card";
import { Card } from "@shared/common/Cards";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const cardWidth = 150;

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
    const { t } = useTranslation('game');

    const getCanPlayOfCard = (card: Card) => {
        switch (card.cardType) {
            case "BestPractice":
                if (playerState.badPractice) return {canPlay: false, cause: t('errors.blockedBy', { type: playerState.badPractice })};
                return {canPlay: true, cause: ''};
            case "BadPractice":
                if (nbOtherPlayersNotBlocked > 0) return {canPlay: true, cause: ''};
                return {canPlay: false, cause: t('errors.noOneLeft')};
            case "Expert":
                return {canPlay: true, cause: ''};
            case "Formation":
                if (playerState.badPractice === card.actor) return {canPlay: true, cause: ''};
                return {canPlay: false, cause: t('errors.wrongFormationType', { type: card.actor })};
            default:
                return {canPlay: false, cause: t('errors.cannotPlay')};
        }
    }

    return (
        <div className={`${styles.playerTable}`}>

            <DiscardArea
                width={cardWidth}
                className={styles.discardArea}
                onCardDiscarded={onDiscardCard}
                title={t('discard.title')}
            />

            <PlayerHand
                cards={playerState.cardsInHand.map((card) => ({
                    card: card,
                    ...getCanPlayOfCard(card),
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
                placeholder={t('history.title')}
                dataTooltip={t('history.tooltip')}
            />
        </div>
    )
};

export default PlayerTable;