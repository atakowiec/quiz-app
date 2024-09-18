import { configureStore } from "@reduxjs/toolkit";
import userSlice, { UserState } from "./userSlice.ts";
import gameSlice, { GameState } from "./gameSlice.ts";

export type State = {
  user: UserState;
  game: GameState;
};

export const store = configureStore<State>({
  reducer: {
    user: userSlice.reducer,
    game: gameSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
