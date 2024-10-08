import { Server as SocketIOServer, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/socket";
import { User } from "../user/user.model";

export type SocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  null,
  SocketData
>;
export type SocketServerType = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  null,
  SocketData
>;

export interface SocketData {
  user?: User;
  username: string;
}
