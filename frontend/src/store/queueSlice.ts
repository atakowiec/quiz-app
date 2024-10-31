import {createSlice} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import {State} from "./index.ts";

export type QueueState = {
    inQueue: boolean;
    fromDate: Date;
}

const queueSlice = createSlice({
    name: 'queue',
    initialState: {
        inQueue: false,
        fromDate: new Date(),
    } as QueueState,
    reducers: {
        setInQueue(state, action) {
            state.inQueue = action.payload; // Set inQueue to true or false
            state.fromDate = new Date();
        },
        clearQueue(state) {
            state.inQueue = false; // Reset inQueue to false
        },
    },
});

export const {
    setInQueue,
    clearQueue,
} = queueSlice.actions;

export default queueSlice;

export const useQueue = () => useSelector( (state: State) => state.queue );