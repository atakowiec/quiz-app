import { GameUpdatePacket, IGamePacket } from "./game";

export interface ServerToClientEvents {
  send_message: (message: string) => void;
  notification: (message: string) => void;
  exception: (message: string | object) => void;
  set_game: (game: IGamePacket) => void;
  update_game: (game: GameUpdatePacket) => void;
}

export type ServerToClientEventsKeys = keyof ServerToClientEvents;

export interface ClientToServerEvents {
  create_game: (gameMode: string, cb: () => void) => void;
  join_game: (gameId: string, cb: () => void) => void;
  leave_game: () => void;
  kick: (username: string) => void;
  give_owner: (username: string) => void;
  start_game: () => void;
  select_category: (categoryId: number) => void;
  select_answer: (answer: string) => void;
  use_helper: (helperName: string) => void;
}

export type ClientToServerEventsKeys = keyof ClientToServerEvents;
