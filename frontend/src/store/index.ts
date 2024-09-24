import { configureStore } from "@reduxjs/toolkit";
import userSlice, { UserState } from "./userSlice.ts";
import gameSlice, { GameState } from "./gameSlice.ts";
import globalDataSlice, { GlobalDataState } from "./globalDataSlice.ts";

export type State = {
  user: UserState;
  game: GameState;
  globalData: GlobalDataState;
};

export const store = configureStore<State>({
  reducer: {
    user: userSlice.reducer,
    game: gameSlice.reducer,
    globalData: globalDataSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
