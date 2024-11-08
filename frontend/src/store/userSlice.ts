import { createSlice } from "@reduxjs/toolkit";
import { UserPacket } from "@shared/user";
import { useSelector } from "react-redux";
import { State } from "./index.ts";
import { Friend, IFriendRequest } from "@shared/friends";

export type UserState = {
  loggedIn: boolean;
  id?: number;
  username?: string;
  email?: string;
  permission?: number;
  friends?: Friend[]
  friendRequests?: IFriendRequest[]
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
          username: action.payload?.username
        };
      }

      const userPacket = action.payload as UserPacket;

      return {
        loggedIn: !!userPacket.id,
        id: userPacket.id,
        username: userPacket.username,
        email: userPacket.email,
        permission: userPacket.permission,
        friends: [],
        friendRequests: []
      };
      
    },
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
    
    newFriendship(state, action) {
      const friends: Friend[] = state.friends ?? [];
      const newFriend: Friend = action.payload;

      console.log("newFriend", newFriend);

      return {
        ...state,
        friends: [...friends, newFriend]
      };
    },
    setFriendships(state, action) {
      return {
        ...state,
        friends: action.payload
      };
    },
    updateFriendStatus(state, action) {
      const friends: Friend[] = state.friends ?? [];
      const { friendId, newStatus } = action.payload;

      const friend = friends.find(friend => friend.id === friendId);

      if (friend) {
        friend.status = newStatus
      }
    },
    removeFriendship(state, action) {
      const friends: Friend[] = state.friends ?? [];
      const friendId = action.payload;

      return {
        ...state,
        friends: friends.filter(friend => friend.id !== friendId)
      };
    },
    setFriendRequests(state, action) {
      return {
        ...state,
        friendRequests: action.payload
      };
    },
    newFriendRequest(state, action) {
      const friendRequests: IFriendRequest[] = state.friendRequests ?? [];
      const newFriendRequest: IFriendRequest = action.payload;

      console.log(newFriendRequest)

      return {
        ...state,
        friendRequests: [...friendRequests, newFriendRequest]
      };
    },
    removeFriendRequest(state, action) {
      const friendRequests: IFriendRequest[] = state.friendRequests ?? [];
      const friendRequestId: string = action.payload;

      return {
        ...state,
        friendRequests: friendRequests.filter(fr => fr.id !== friendRequestId)
      }
    }
  },
});

export const userActions = userSlice.actions;

export default userSlice;

export const useUser = () => useSelector((state: State) => state.user);
