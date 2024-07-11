import { useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { SocketManagerContext } from '@app/js/components/websocket/SocketManagerProvider';
import SocketState from '@app/js/components/websocket/SocketState';

export default function useSocketManager() {
  const sm = useContext(SocketManagerContext);
  const socket = useRecoilValue(SocketState);

  return {sm, socket};
}
