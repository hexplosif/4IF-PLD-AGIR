import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Listener } from "@app/js/components/websocket/types";
import { ServerPayloads } from "@shared/server/ServerPayloads";
import { ServerEvents } from "@shared/server/ServerEvents";
import { PracticeQuestionState, SensibilisationQuestionState, AskDrawModeState, PlayCardState, GameState } from "@app/js/states/gameStates";
import SocketManager from "@app/js/components/websocket/SocketManager";
import { notifications } from "@mantine/notifications";
import { CardAction } from "@shared/server/types";
import { useAnimationManager } from "../../useAnimationManager";
import { AnimationType } from "../../useAnimationManager/constants";

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

    const {play, resetToStart} = useAnimationManager();

    const onGetSensibilisationQuestion = useCallback<SensibilisationQuestionHandler>(async (data) => {
        setSensibilisationQuestion(data);
    }, []);

    const onSensibilisationAnswered = useCallback<SensibilisationAnsweredHander>(async (data) => {
        const playersNamesAnsweredCorrectly = data.playersAnsweredCorrectly.map((player) => { 
            return player.clientInGameId === localStorage.getItem('clientInGameId') ? 'you' : player.pseudo;
        });
        
        let message : string;
        if (playersNamesAnsweredCorrectly.length === 0) {
            message = "No players answered the sensibilisation question correctly. Move to next question!";
        } else if (playersNamesAnsweredCorrectly.length === 1) {
            message = `Only ${playersNamesAnsweredCorrectly[0]} has answered the sensibilisation question correctly and can now play this round.`;
        } else {
            message = `${playersNamesAnsweredCorrectly.join(", ")} have answered the sensibilisation question correctly and can now play this round.`;
        }
        
        // Display notification
        notifications.show({
            title: "Question Result", 
            message,
            autoClose: 3000,
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
        setPlayCardState(data);
        await new Promise(resolve => setTimeout(resolve, 200)); // wait for the state updated
        const thisPlayerId = localStorage.getItem('clientInGameId');
        switch (data.action) {
            case CardAction.DISCARD:
                if (data?.playerId !== thisPlayerId) {
                    await play(AnimationType.DiscardCard);
                }
                break;
            case CardAction.DRAW:
                await play(AnimationType.DrawCard);
                break;
            case CardAction.PLAY: 
                if (data?.playerId !== thisPlayerId) {
                    await play(AnimationType.PlayCard);
                }
                break;
        }
        setPlayCardState(null);
    
        // update the game state with the new player state
        setGameState((prevState) => ({
            ...prevState,
            playerStates: Object.values( data.playerStates ), 
        }));
        resetToStart(AnimationType.DiscardCard);
        resetToStart(AnimationType.DrawCard);
        resetToStart(AnimationType.PlayCard);
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