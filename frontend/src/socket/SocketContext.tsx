import { ReactNode, createContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/socket";

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<SocketType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useMemo(() => {
    const newSocket: SocketType = io("http://localhost:3000", {
      withCredentials: true, // this will to send a cookie with token automatically with the handshake
      autoConnect: false, // we don't want to connect immediately - socket will connect only when the user will enter its name or log in.
      transports: ["websocket"], // dunno why, but I guess it won't work without this
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    return newSocket;
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
