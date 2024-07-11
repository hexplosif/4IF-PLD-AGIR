import { SocketState } from "@app/js/components/websocket/SocketState";
import { Listener } from "@app/js/components/websocket/types";
import { ClientEvents } from "@shared/client/ClientEvents";
import { ClientPayloads } from "@shared/client/ClientPayloads";
import { ServerEvents } from "@shared/server/ServerEvents";
import { ServerExceptionResponse } from "@shared/server/types";
import { SetterOrUpdater } from "recoil";
import { io, Socket } from "socket.io-client";
import { notifications } from "@mantine/notifications";

type EmitOptions<T extends ClientEvents> = {
  event: T;
  data?: ClientPayloads[T];
};

export default class SocketManager {
  public readonly socket: Socket;

  public setSocketState: SetterOrUpdater<SocketState> = () => {};

  private connectionLost: boolean = false;

  constructor() {
    this.socket = io(
      `${import.meta.env.VITE_API_URL}` /*import.meta.env.API_URL as string*/,
      {
        autoConnect: false,
        path: "/wsapi",
        transports: ["websocket"],
        withCredentials: true,
      }
    );

    this.onConnect();
    this.onDisconnect();
    this.onException();
    this.onNotification();
  }

  emit<T extends ClientEvents>(options: EmitOptions<T>): this {
    if (this.socket.connected) {
      console.log("Emitting event socketManager", options.event, options.data);
      this.socket.emit(options.event, options.data);
    } else {
      console.error("Socket is not connected. Cannot emit event.");
    }

    return this;
  }

  getSocketId(): string | null {
    if (!this.socket.connected || !this.socket.id) {
      return null;
    }

    return this.socket.id;
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  registerListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.on(event, listener);
    console.log("[SocketManager] Registering listener", event);

    return this;
  }

  removeListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.off(event, listener);

    return this;
  }

  private onNotification(): void {
    console.log('[socketManager] onNotification ')
    this.socket.on('notification', (data) => {
      notifications.show({
        message: data.message,
        color: "orange",
        autoClose: 3000,
      });
    });
  }

  private onConnect(): void {
    this.socket.on("connect", () => {
      if (this.connectionLost) {
        notifications.show({
          message: "Reconnected to server!",
          color: "green",
          autoClose: 2000,
        });
        this.connectionLost = false;
      }
      if (localStorage.getItem("clientInGameId")) {
        this.emit({
          event: ClientEvents.ClientReconnect,
          data: {
            clientInGameId: localStorage.getItem("clientInGameId")!,
          },
        });
      }
      this.setSocketState((currVal) => {
        return { ...currVal, connected: true };
      });
    });
  }

  private onDisconnect(): void {
    this.socket.on("disconnect", async (reason: Socket.DisconnectReason) => {
      if (reason === "io client disconnect") {
        notifications.show({
          message: "Disconnected successfully!",
          color: "green",
          autoClose: 2000,
        });
        if(localStorage.getItem("clientInGameId")) {
          this.emit({
            event:  ClientEvents.playerDisconnected,
            data: {
              playerId: localStorage.getItem("clientInGameId")!,
              message: "A player has disconnected from the game",
            },
          });

        }
      }

      if (reason === "io server disconnect") {
        notifications.show({
          message: "You got disconnect by server",
          color: "orange",
          autoClose: 3000,
        });
      }

      if (
        reason === "ping timeout" ||
        reason === "transport close" ||
        reason === "transport error"
      ) {
        notifications.show({
          message: "Connection lost to the server",
          color: "orange",
          autoClose: 3000,
        });
        this.connectionLost = true;
      }

      this.setSocketState((currVal) => {
        return { ...currVal, connected: false };
      });

      
    });
  }

  private onException(): void {
    this.socket.on("exception", (data: ServerExceptionResponse) => {
      if (typeof data.exception === "undefined") {
        notifications.show({
          message: "Unexpected error from server",
          color: "red",
        });

        return;
      }

      let body = `Error: ${data.exception}`;

      if (data.message) {
        if (typeof data.message === "string") {
          body += ` | Message: "${data.message}"`;
        } else if (typeof data.message === "object") {
          body += ` | Message: "${JSON.stringify(data.message)}"`;
        }
      }

      const currentPath = window.location.pathname;
      if (currentPath !== "/createGame" && currentPath !== "/joinGame") {
        notifications.show({
          title: data.exception,
          message: body,
          color: "red",
        });
      }
      console.error(`Error ${data.exception}`, `Message: ${data.message}`);
    });
  }
}
