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
  user?: User; // todo propably I need to change this to just id and fetch user from db when needed because the user details can change during the connection
  username: string;
  iconColor: string;
  gameId?: string;
}

export interface CategoryUserScore {
  categoryId: number;
  userId: number;
  score: number;
}
