import { ReactNode, createContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/socket";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { gameActions } from "../store/gameSlice";
import { toast } from "react-toastify";

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<SocketType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const socket: SocketType = useMemo(() => {
    const newSocket: SocketType = io("http://localhost:3000", {
      withCredentials: true, // this will to send a cookie with token automatically with the handshake
      autoConnect: false, // we don't want to connect immediately - socket will connect only when the user will enter its name or log in.
      transports: ["websocket"], // dunno why, but I guess it won't work without this
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("set_game", (game) => dispatch(gameActions.setGame(game)));

    newSocket.on("update_game", (game) =>
      dispatch(gameActions.updateGame(game))
    );

    // todo - stringyfing the message is a temporary solution - now we can see a json object in the toast
    newSocket.on("exception", (message) =>
      toast.error(JSON.stringify(message))
    );
    newSocket.on("notification", (message) => toast.info(message));
    return newSocket;
  }, []);

  // clean up the socket listeners
  useEffect(() => {
    return () => {
      socket.offAny();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
