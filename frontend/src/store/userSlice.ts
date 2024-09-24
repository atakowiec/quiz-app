import { createSlice } from "@reduxjs/toolkit";
import { UserPacket } from "@shared/user";
import { useSelector } from "react-redux";
import { State } from "./index.ts";

export type UserState = {
  loggedIn: boolean;
  id?: number;
  username?: string;
  email?: string;
  permission?: number;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedIn: false,
  } as UserState,
  reducers: {
    setUser: (_, action): UserState => {
      if (!action.payload?.id) {
        return {
          loggedIn: false,
          username: !action.payload?.username
            ? undefined
            : action.payload.username,
        };
      }

      const userPacket = action.payload as UserPacket;

      return {
        loggedIn: true,
        id: userPacket.id,
        username: userPacket.username,
        email: userPacket.email,
        permission: userPacket.permission,
      };
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;

export const useUser = () => useSelector((state: State) => state.user);
