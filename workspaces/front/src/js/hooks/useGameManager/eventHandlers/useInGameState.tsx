import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Listener } from "@app/js/components/websocket/types";
import { ServerPayloads } from "@shared/server/ServerPayloads";
import { ServerEvents } from "@shared/server/ServerEvents";
import { PracticeQuestionState, SensibilisationQuestionState, AskDrawModeState, PlayCardState, GameState } from "@app/js/states/gameStates";
import SocketManager from "@app/js/components/websocket/SocketManager";
import { notifications } from "@mantine/notifications";
import { CardAction } from "@shared/server/types";

type SensibilisationQuestionHandler = Listener<ServerPayloads[ServerEvents.SensibilisationQuestion]>
type SensibilisationAnsweredHander = Listener<ServerPayloads[ServerEvents.SensibilisationAnswered]>
type PracticeAnsweredHandler = Listener<ServerPayloads[ServerEvents.PracticeAnswered]>
type AskDrawModeHandler = Listener<ServerPayloads[ServerEvents.AskDrawMode]>
type PlayerPlayCardActionHandler = Listener<ServerPayloads[ServerEvents.PlayerCardAction]>
type PlayerDisconnectedHandler = Listener<ServerPayloads[ServerEvents.GamePlayerDisconnection]>

type useGameStateProps = {
    sm: SocketManager,
    isSmConnected: boolean,
}
const useInGameState = ({
    sm,
    isSmConnected,
} : useGameStateProps) => {
    const [_1, setSensibilisationQuestion] = useRecoilState( SensibilisationQuestionState );
    const [_2, setPracticeQuestion] = useRecoilState( PracticeQuestionState );
    const [_3, setAskDrawMode] = useRecoilState( AskDrawModeState );
    const [_4, setGameState] = useRecoilState( GameState );
    const [_5, setPlayCardState] = useRecoilState( PlayCardState );

    const onGetSensibilisationQuestion = useCallback<SensibilisationQuestionHandler>(async (data) => {
        setSensibilisationQuestion(data);
    }, []);

    const onSensibilisationAnswered = useCallback<SensibilisationAnsweredHander>(async (data) => {
        const playersNamesAnsweredCorrectly = data.playersAnsweredCorrectly.map((player) => { 
            if (player.clientInGameId === localStorage.getItem('clientInGameId')) return 'you';
            return player.pseudo;
        });

        // Display a notification for each player who answered correctly
        notifications.show({
            title: "Sensibilisation question answered", // TODO: modify message to look more clearly
            message: `players : ${playersNamesAnsweredCorrectly.join(", ")} - answered the sensibilisation question correctly and are now allowed to play this round.`,
        });

        setSensibilisationQuestion(null);
    }, []);

    const onPracticeAnswered = useCallback<PracticeAnsweredHandler>(async (data) => {
        setPracticeQuestion(null);
    }, []);

    const onAskDrawMode = useCallback<AskDrawModeHandler>(async (data) => {
        setAskDrawMode(data);
    }, []);

    const onPlayCardAction = useCallback<PlayerPlayCardActionHandler>(async (data) => {
        // TODO: add animation for this
        console.log("PlayCardAction", data);
        switch (data.action) {
            case CardAction.DISCARD:
                notifications.show({
                    title: "2s simulate the animation of discarding a card",
                    message: `${data.playerState.playerName} discarded a card`,
                    color: "red",
                    autoClose: 2000,
                });
                break;
            case CardAction.DRAW:
                setPlayCardState(data);
                break;
            case CardAction.PLAY: 
                notifications.show({
                    title: "2s simulate the animation of playing a card",
                    message: `${data.playerState.playerName} played a card: ${data.card.cardType}`,
                    color: "blue",
                    autoClose: 2000,
                });
                break;
        }
        
        // wait 3 seconds (simulate animation) before updating the game state
        await new Promise(resolve => setTimeout(resolve, 2000));

        // update the game state with the new player state
        setGameState((prevState) => ({
            ...prevState,
            currentPlayerId: data.playerState.clientInGameId,
            playerStates: prevState.playerStates.map((player) => {
                if (player.clientInGameId === data.playerState.clientInGameId) {
                    return { ...player, cardsInHand: data.playerState.cardsInHand };
                }
                return player;
            }),
        }));
        if (data.action !== CardAction.DRAW) {
            setPlayCardState(data);
        }
    }, []);

    const onPlayerDisconnected = useCallback<PlayerDisconnectedHandler>(async (data) => {
        notifications.show({
            title: "Player disconnected",
            message: `${data.clientName} has left the game.`,
            color: "red",
        });
    }, []);

    useEffect(() => {
        if (!isSmConnected) return;

        if (!sm.socket.hasListeners(ServerEvents.PlayerCardAction))
            sm.registerListener(ServerEvents.PlayerCardAction, onPlayCardAction);

        if (!sm.socket.hasListeners(ServerEvents.SensibilisationQuestion))
            sm.registerListener(ServerEvents.SensibilisationQuestion, onGetSensibilisationQuestion);

        if (!sm.socket.hasListeners(ServerEvents.SensibilisationAnswered))
            sm.registerListener(ServerEvents.SensibilisationAnswered, onSensibilisationAnswered);

        if (!sm.socket.hasListeners(ServerEvents.PracticeAnswered))
            sm.registerListener(ServerEvents.PracticeAnswered, onPracticeAnswered);

        if (!sm.socket.hasListeners(ServerEvents.AskDrawMode))
            sm.registerListener(ServerEvents.AskDrawMode, onAskDrawMode);

        if (!sm.socket.hasListeners(ServerEvents.GamePlayerDisconnection))
            sm.registerListener(ServerEvents.GamePlayerDisconnection, onPlayerDisconnected);

        return () => {
            sm.removeListener(ServerEvents.PlayerCardAction, onPlayCardAction);
            sm.removeListener(ServerEvents.SensibilisationQuestion, onGetSensibilisationQuestion);
            sm.removeListener(ServerEvents.SensibilisationAnswered, onSensibilisationAnswered);
            sm.removeListener(ServerEvents.PracticeAnswered, onPracticeAnswered);
            sm.removeListener(ServerEvents.AskDrawMode, onAskDrawMode);
            sm.removeListener(ServerEvents.GamePlayerDisconnection, onPlayerDisconnected);
        }
    }, [isSmConnected])

    return {}
}

export default useInGameState;