import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Listener } from "@app/js/components/websocket/types";
import { ServerPayloads } from "@shared/server/ServerPayloads";
import { ServerEvents } from "@shared/server/ServerEvents";
import { GameState, PracticeQuestionState, SensibilisationQuestionState, UseSensibilisationPointsState } from "@app/js/states/gameStates";
import { useNavigate } from "react-router";
import SocketManager from "@app/js/components/websocket/SocketManager";
import { notifications } from "@mantine/notifications";
import { Bad_Practice_Card } from "@shared/common/Cards";

type CardPlayedHandler = Listener<ServerPayloads[ServerEvents.CardPlayed]>

type SensibilisationQuestionHandler = Listener<ServerPayloads[ServerEvents.SensibilisationQuestion]>
type SensibilisationAnsweredHander = Listener<ServerPayloads[ServerEvents.SensibilisationAnswered]>
type PlayerPassedHandler = Listener<ServerPayloads[ServerEvents.PlayerPassed]>
type PracticeAnsweredHandler = Listener<ServerPayloads[ServerEvents.PracticeAnswered]>

type UseSensibilisationPointsHandler = Listener<ServerPayloads[ServerEvents.UseSensibilisationPoints]>

type PlayerDisconnectedHandler = Listener<ServerPayloads[ServerEvents.GamePlayerDisconnection]>

type useGameStateProps = {
    sm: SocketManager,
    isSmConnected: boolean,
}
const useInGameState = ({
    sm,
    isSmConnected,
} : useGameStateProps) => {
    const [gameState, setGameState] = useRecoilState( GameState );
    const [_1, setSensibilisationQuestion] = useRecoilState( SensibilisationQuestionState );
    const [_2, setPracticeQuestion] = useRecoilState( PracticeQuestionState );
    const [_3, setUseSensibilisationPoints] = useRecoilState( UseSensibilisationPointsState );

    const onCardPlayed = useCallback<CardPlayedHandler>(async (data) => {
        let message = "";
        if (data.discarded) {
            message = `${data.playerName} discarded a ${data.card.cardType} card`;
        } else {
            switch (data.card.cardType) {
                case "BadPractice":
                    message = `${data.playerName} played a Bad Practice card to ${gameState?.playerStates.find((p) => p.clientInGameId === (data.card as Bad_Practice_Card).targetedPlayerId)?.playerName}`;
                    break;
                case "BestPractice":
                    message = `${data.playerName} played a Best Practice card`;
                    break;
                case "Expert":
                    message = `${data.playerName} played an Expert card and is now immuned to ${data.card.actor} bad pratices`;
                    break;
                case "Formation":
                    message = `${data.playerName} played a Formation card and has cured the ${data.card.actor} bad pratice`;
                    break;
                }
            }
        
            notifications.show({
                title: "Card played",
                message,
            });
              
            if (["BestPractice", "BadPractice"].includes(data.card.cardType)) {
                setPracticeQuestion(data);
            }
    },[]);

    const onGetSensibilisationQuestion = useCallback<SensibilisationQuestionHandler>(async (data) => {
        setSensibilisationQuestion(data);
    }, []);

    const onSensibilisationAnswered = useCallback<SensibilisationAnsweredHander>(async (data) => {
        setSensibilisationQuestion(null);
    }, []);

    const onPlayerPassed = useCallback<PlayerPassedHandler>(async (data) => {
        notifications.show({
            title: "Player passed turn",
            message: `${data.playerName} passed his turn because he has not yet answered correctly to the sensibilisation question`,
            color: "orange",
        });
    }, []);

    const onPracticeAnswered = useCallback<PracticeAnsweredHandler>(async (data) => {
        setPracticeQuestion(null);
    }, []);

    const onUseSensibilisationPoints = useCallback<UseSensibilisationPointsHandler>(async (data) => {
        setUseSensibilisationPoints(data);
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

        if (!sm.socket.hasListeners(ServerEvents.CardPlayed))
            sm.registerListener(ServerEvents.CardPlayed, onCardPlayed);

        if (!sm.socket.hasListeners(ServerEvents.SensibilisationQuestion))
            sm.registerListener(ServerEvents.SensibilisationQuestion, onGetSensibilisationQuestion);

        if (!sm.socket.hasListeners(ServerEvents.SensibilisationAnswered))
            sm.registerListener(ServerEvents.SensibilisationAnswered, onSensibilisationAnswered);

        if (!sm.socket.hasListeners(ServerEvents.PlayerPassed))
            sm.registerListener(ServerEvents.PlayerPassed, onPlayerPassed);

        if (!sm.socket.hasListeners(ServerEvents.PracticeAnswered))
            sm.registerListener(ServerEvents.PracticeAnswered, onPracticeAnswered);

        if (!sm.socket.hasListeners(ServerEvents.UseSensibilisationPoints))
            sm.registerListener(ServerEvents.UseSensibilisationPoints, onUseSensibilisationPoints);

        if (!sm.socket.hasListeners(ServerEvents.GamePlayerDisconnection))
            sm.registerListener(ServerEvents.GamePlayerDisconnection, onPlayerDisconnected);

        return () => {
            sm.removeListener(ServerEvents.CardPlayed, onCardPlayed);
            sm.removeListener(ServerEvents.SensibilisationQuestion, onGetSensibilisationQuestion);
            sm.removeListener(ServerEvents.SensibilisationAnswered, onSensibilisationAnswered);
            sm.removeListener(ServerEvents.PlayerPassed, onPlayerPassed);
            sm.removeListener(ServerEvents.PracticeAnswered, onPracticeAnswered);
            sm.removeListener(ServerEvents.UseSensibilisationPoints, onUseSensibilisationPoints);
            sm.removeListener(ServerEvents.GamePlayerDisconnection, onPlayerDisconnected);
        }
    }, [isSmConnected])

    return {}
}

export default useInGameState;