import { configureStore } from "@reduxjs/toolkit";
import userSlice, { UserState } from "./userSlice.ts";
import gameSlice, { GameState } from "./gameSlice.ts";
import globalDataSlice, { GlobalDataState } from "./globalDataSlice.ts";
import { INotification } from "@shared/notifications";
import notificationsSlice from "./notificationsSlice.ts";

export type State = {
  user: UserState;
  game: GameState;
  globalData: GlobalDataState;
  notifications: INotification[];
};

export const store = configureStore<State>({
  reducer: {
    user: userSlice.reducer,
    game: gameSlice.reducer,
    globalData: globalDataSlice.reducer,
    notifications: notificationsSlice.reducer
  },
});

export type AppDispatch = typeof store.dispatch;
