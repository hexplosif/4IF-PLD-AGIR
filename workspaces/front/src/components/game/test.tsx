import useSocketManager from "@app/js/hooks/useSocketManager";
import { ClientEvents } from "@shared/client/ClientEvents";
import { ServerEvents } from "@shared/server/ServerEvents";
import { useEffect } from "react";
import { Listener } from "../../js/components/websocket/workspaces/front/workspaces/front/src/js/js/component/types";
import { ServerPayloads } from "@shared/server/ServerPayloads";
import { useState } from "react";

export default function Test() {
  const { sm } = useSocketManager();
  const [connectionCode, setConnectionCode] = useState('');
  useEffect(() => {
    sm.connect();
    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = (data) => {
      console.log(data);
    }

    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
    }
  }, []);
  const ping = () => {
    sm.emit({ event: ClientEvents.LobbyCreate, data: { playerName: 'Loulou', co2Quantity: 1000 } })
  }
  const joinLobby = () => {
    console.log(connectionCode);
    sm.emit({ event: ClientEvents.LobbyJoin, data: { connectionCode, playerName: 'Missa' } })
  }
  const handleInputChange = (event: any) => {
    setConnectionCode(event.target.value);
  };
  return (
    <div>
      <button onClick={ping}>Ping</button>
      <input type="text" placeholder="ConnectionCode" value={connectionCode} onChange={handleInputChange} />
      <button onClick={joinLobby}>Join Lobby</button>
    </div>
  )
}
