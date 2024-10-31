import { FriendshipStatus, UserStatus } from "@shared/user";
import { UserState } from "../store/userSlice.ts";
import { Friend, IFriendRequest } from "@shared/friends";


export function translateUserStatus(status: UserStatus) {
  return {
    online: "Online",
    offline: "Offline",
    ingame: "W grze"
  }[status];
}

export function getFriend(user: UserState, userId: number): Friend | null {
  return user.friends?.find(f => f.id === userId) ?? null;
}

export function getFriendRequest(user: UserState, userId: number): IFriendRequest | null {
  return user.friendRequests?.find(f => f.invitee.id === userId || f.inviter.id === userId) ?? null;
}

export function getFriendshipStatus(user: UserState, userId: number): FriendshipStatus {
  const friend = getFriend(user, userId);

  if (friend)
    return "friend";

  const friendRequest = getFriendRequest(user, userId);

  if (!friendRequest)
    return "none";

  if (friendRequest.inviter.id === user.id)
    return "requested";

  if (friendRequest.invitee.id === user.id)
    return "pending";

  return "none";
}
