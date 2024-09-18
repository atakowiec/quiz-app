import { createSlice } from "@reduxjs/toolkit";
import { GameSettings, GameStatus, GameType, IGameMember } from "@shared/game";

export type GameState = {
  id: string;
  owner: IGameMember;
  players?: Partial<IGameMember>[];
  settings: GameSettings;
  gameType: GameType;
  status: GameStatus;
  winner?: Partial<IGameMember>;
} | null;

const gameSlice = createSlice({
  name: "game",
  initialState: null as GameState,
  reducers: {
    setGame: (_, action) => action.payload,
  },
});

export const gameActions = gameSlice.actions;

export default gameSlice;
