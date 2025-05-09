import SocketManager from '@app/js/components/websocket/SocketManager';
import SocketState from '@app/js/components/websocket/SocketState';
import React, { createContext } from 'react';
import { useSetRecoilState } from 'recoil';

const socketManager = new SocketManager();

export const SocketManagerContext = createContext<SocketManager>(socketManager);

type ProviderProps = {
  children: React.ReactNode;
};

export function SocketManagerProvider({ children }: ProviderProps) {
  socketManager.setSocketState = useSetRecoilState(SocketState);

  return <SocketManagerContext.Provider value={socketManager}>{children}</SocketManagerContext.Provider>;
}
