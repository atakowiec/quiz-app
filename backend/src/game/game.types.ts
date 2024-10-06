import { Server as SocketIOServer, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/socket";

export type SocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
>;
export type SocketServerType = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
>;

export interface SocketData {
  username: string;
  gameId?: string;
  isServer?: boolean;
}
