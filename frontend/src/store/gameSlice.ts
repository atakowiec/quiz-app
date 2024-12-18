import { createSlice } from "@reduxjs/toolkit";
import { GameUpdatePacket, IGamePacket } from "@shared/game";
import lodash from "lodash";
import { State } from "./index.ts";
import { useSelector } from "react-redux";

export type GameState = IGamePacket | null;

const gameSlice = createSlice({
  name: "game",
  initialState: null as GameState,
  reducers: {
    setGame: (_, action) => action.payload,
    updateGame: (state: GameState, action: { payload: GameUpdatePacket }) => {
      if (!state) return null;

      const updatePacket = action.payload;

      // we will merge the members in the other way so for now keep them in another variable
      const playersUpdate = updatePacket.players;

      delete updatePacket.players;

      const newState = lodash.merge(state, updatePacket);

      // if there are no players or no update for the players we can return the new state with previous players
      if (!playersUpdate) {
        return newState;
      }

      // merge the `player` and `owner` members if the update packet of players contains them
      if (playersUpdate.find((p) => p.username === newState.owner?.username)) {
        newState.owner = lodash.merge(
          newState.owner,
          playersUpdate.find((p) => p.username === newState.owner?.username)
        );
      }

      if (playersUpdate.find((p) => p.username === newState.player?.username)) {
        newState.player = lodash.merge(
          newState.player,
          playersUpdate.find((p) => p.username === newState.player?.username)
        );
      }

      // iterate over the players and update them - hopefully it will work
      newState.players = newState.players?.map((player) => {
        const playerUpdate = playersUpdate.find(
          (p) => p.username === player.username
        );
        return lodash.merge(player, playerUpdate);
      });

      return newState;
    },
  },
});

export const gameActions = gameSlice.actions;

export default gameSlice;

export const useGame = () => useSelector((state: State) => state.game);
