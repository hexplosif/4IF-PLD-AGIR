import useSocketManager from "../useSocketManager";
import { useEffect, useState } from "react";
import { useGameState, useInGameState, useLobbyState } from "./eventHandlers";

const useGameManager = () => {
    const { sm, socket } = useSocketManager();
    const [isSmConnected, setIsSmConnected] = useState(socket.connected);

    useGameState({sm, isSmConnected});
    useLobbyState({sm, isSmConnected});
    useInGameState({sm, isSmConnected});

    useEffect(() => {
        if (!socket.connected) {
          sm.connect();
        }
    }, []);

    useEffect(() => {
        setIsSmConnected(socket.connected);
    }, [socket.connected]);

    return { sm };
}

export default useGameManager;