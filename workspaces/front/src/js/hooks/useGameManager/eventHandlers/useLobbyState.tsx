import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Listener } from "@app/js/components/websocket/types";
import { ServerPayloads } from "@shared/server/ServerPayloads";
import { ServerEvents } from "@shared/server/ServerEvents";
import { LobbyState } from  "@app/js/states/gameStates";
import { useNavigate } from "react-router";
import SocketManager from "@app/js/components/websocket/SocketManager";

type LobbyStateHandler = Listener<ServerPayloads[ServerEvents.LobbyState]>
type LobbyJoinedStateHandler = Listener<ServerPayloads[ServerEvents.LobbyJoined]>

type useLobbyStateProps = {
    sm: SocketManager,
    isSmConnected: boolean,
}
const useLobbyState = ({
    sm,
    isSmConnected
} : useLobbyStateProps) => {

    const [lobbyState, setLobbyState] = useRecoilState(LobbyState);
    const navigate = useNavigate();

    const onLobbyState = useCallback<LobbyStateHandler>((data) => {
        console.log("[Lobby State] Setting up event listener");
        if (!location.pathname.includes("/game")) {
            setLobbyState(data);
            localStorage.setItem("ownerId", data.ownerId);
            if (!location.pathname.includes("/lobby")) {
                navigate(`/lobby/${data.lobbyId}`);
            }
        }
    }, []);

    const onLobbyJoined = useCallback<LobbyJoinedStateHandler>((data) => {
        console.log("[Lobby Joined] Lobby clientInGameId:", data.clientInGameId);
        localStorage.setItem("clientInGameId", data.clientInGameId);
        console.log(
          "[GameManager] Lobby clientInGameId after set:",
          data.clientInGameId
        );
    }, []);

    useEffect(() => {
        if (!isSmConnected) return;

        if (!sm.socket.hasListeners(ServerEvents.LobbyState))
            sm.registerListener(ServerEvents.LobbyState, onLobbyState);
        if (!sm.socket.hasListeners(ServerEvents.LobbyJoined))
            sm.registerListener(ServerEvents.LobbyJoined, onLobbyJoined);

        return () => {
            sm.removeListener(ServerEvents.LobbyState, onLobbyState);
            sm.removeListener(ServerEvents.LobbyJoined, onLobbyJoined);
        }
    }, [isSmConnected])

    return {
        lobbyState
    }
}

export default useLobbyState;