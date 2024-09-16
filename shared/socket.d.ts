export interface ServerToClientEvents {
  game_update: (game: GamePacket) => void;
  send_message: (message: string) => void;
}

export type ServerToClientEventsKeys = keyof ServerToClientEvents;

export interface ClientToServerEvents {
  create_game: (mapId?: string, cb?: () => void) => void;
  join_game: (gameId: string) => void;
}
export type ClientToServerEventsKeys = keyof ClientToServerEvents;
