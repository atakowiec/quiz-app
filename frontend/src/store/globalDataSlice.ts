import { createSlice } from "@reduxjs/toolkit";
import { ICategory } from "@shared/game";
import { State } from "./index.ts";
import { useSelector } from "react-redux";

export type GlobalDataState = {
  categories: ICategory[]
};

const globalDataSlice = createSlice({
  name: "game",
  initialState: {

  } as GlobalDataState,
  reducers: {
    setData: (state: GlobalDataState, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
  },
});

export const globalDataActions = globalDataSlice.actions;

export default globalDataSlice;

export const useGlobalData = () => useSelector((state: State) => state.globalData);
