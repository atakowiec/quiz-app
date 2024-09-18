export interface ServerToClientEvents {
  send_message: (message: string) => void;
  notification: (message: string) => void;
  exception: (message: string | object) => void;
  set_game: (game: GamePacket) => void;
}

export type ServerToClientEventsKeys = keyof ServerToClientEvents;

export interface ClientToServerEvents {
  create_game: (gameMode: string) => void;
  join_game: (gameId: string) => void;
  leave_game: () => void;
}
export type ClientToServerEventsKeys = keyof ClientToServerEvents;
