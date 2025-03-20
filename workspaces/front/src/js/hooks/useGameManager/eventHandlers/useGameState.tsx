import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { ServerPayloads } from "@shared/server/ServerPayloads";
import { ServerEvents } from "@shared/server/ServerEvents";
import { useNavigate } from "react-router";
import { Listener } from "@app/js/components/websocket/types";
import SocketManager from "@app/js/components/websocket/SocketManager";
import { GameState, GameReportState, SensibilisationQuestionState } from "@app/js/states/gameStates";

type GameStateHandler = Listener<ServerPayloads[ServerEvents.GameState]>
type GameStartHandler = Listener<ServerPayloads[ServerEvents.GameStart]>
type GameReportHandler = Listener<ServerPayloads[ServerEvents.GameReport]>

type useGameStateProps = {
    sm: SocketManager,
    isSmConnected: boolean,
}
const useGameState = ({
    sm,
    isSmConnected,
} : useGameStateProps) => {
    const navigate = useNavigate();

    const [gameState, setGameState] = useRecoilState(GameState);
    const [gameReport, setGameReport] = useRecoilState(GameReportState);
    const [_, setSensibilisationQuestion] = useRecoilState( SensibilisationQuestionState );

    const onGameState = useCallback<GameStateHandler>((data) => {
        console.log("[Game State] setGameState");
        setGameState(data);
    }, []);

    const onGameStart = useCallback<GameStartHandler>((data) => {
        console.log("[Game start] Game start data:", data);
        setGameState(data.gameState);
        setSensibilisationQuestion(data.sensibilisationQuestion); //TODO: ?? why
        navigate("/game/");
    }, []);

    const onGameReport = useCallback<GameReportHandler>((data) => {
        setGameReport(data);
        navigate("/game/report/");
    }, []);

    useEffect(() => {
        if (!isSmConnected) return;

        if (!sm.socket.hasListeners(ServerEvents.GameState))
            sm.registerListener(ServerEvents.GameState, onGameState);

        if (!sm.socket.hasListeners(ServerEvents.GameStart))
          sm.registerListener(ServerEvents.GameStart, onGameStart);

        if (!sm.socket.hasListeners(ServerEvents.GameReport))
            sm.registerListener(ServerEvents.GameReport, onGameReport);

        return () => {
            sm.removeListener(ServerEvents.GameState, onGameState);
            sm.removeListener(ServerEvents.GameStart, onGameStart);
            sm.removeListener(ServerEvents.GameReport, onGameReport);
        }
    }, [isSmConnected])

    return {
        gameState, gameReport,
    }
}

export default useGameState;