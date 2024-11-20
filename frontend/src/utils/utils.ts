import { FriendshipStatus, UserStatus } from "@shared/user";
import { UserState } from "../store/userSlice.ts";
import { Friend, IFriendRequest } from "@shared/friends";

export function getTextColor(backgroundColor: string) {
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

    return luminance > 0.8 ? "#000" : "#fff";
}

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
