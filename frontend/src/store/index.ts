import {configureStore} from "@reduxjs/toolkit";
import userSlice, {UserState} from "./userSlice.ts";


export type State = {
  user: UserState
}

export const store = configureStore<State>({
  reducer: {
    user: userSlice.reducer
  }
})