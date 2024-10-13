import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { State } from "./index.ts";
import { INotification } from "@shared/notifications";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [] as INotification[],
  reducers: {
    setNotifications: (_, action) => {
      return action.payload;
    },
    newNotification: (state, action) => {
      state.unshift(action.payload);
    },
    removeNotification: (state, action) => {
      return state.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const notificationsActions = notificationsSlice.actions;

export default notificationsSlice;

export const useNotifications = () => useSelector((state: State) => state.notifications);
