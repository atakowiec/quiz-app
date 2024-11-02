import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { State } from "./index.ts";

export type QueueState = {
  inQueue: boolean;
  fromDate: string | null; // Store as a string for serialization
};

const queueSlice = createSlice({
  name: "queue",
  initialState: {
    inQueue: false,
    fromDate: null, // Initial state set to null
  } as QueueState,
  reducers: {
    setInQueue(state, action) {
      state.inQueue = action.payload; // Set inQueue to true or false
      state.fromDate = new Date().toISOString(); // Store date as an ISO string
    },
    clearQueue(state) {
      state.inQueue = false; // Reset inQueue to false
      state.fromDate = null; // Clear the date
    },
  },
});

export const { setInQueue, clearQueue } = queueSlice.actions;

export default queueSlice;

export const useQueue = () => useSelector((state: State) => state.queue);
