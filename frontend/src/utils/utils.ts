import { FriendshipStatus, UserStatus } from "@shared/user";
import { UserState } from "../store/userSlice.ts";
import { Friend, IFriendRequest } from "@shared/friends";
import getApi from "../api/axios.ts";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ICategory } from "@shared/game";

export function getTextColor(backgroundColor: string) {
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luminance =
    0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

  return luminance > 0.8 ? "#000" : "#fff";
}

export function translateUserStatus(status: UserStatus) {
  return {
    online: "Online",
    offline: "Offline",
    ingame: "W grze",
  }[status];
}

export async function getCategories(): Promise<ICategory[]> {
  try {
    const response: AxiosResponse = await getApi().get("/categories");
    return response.data;
  } catch (error) {
    toast.error("Podczas pobierania kategorii wystąpił błąd");
    return [];
  }
}

export function getFriend(user: UserState, userId: number): Friend | null {
  return user.friends?.find((f) => f.id === userId) ?? null;
}

export function getFriendRequest(
  user: UserState,
  userId: number,
): IFriendRequest | null {
  return (
    user.friendRequests?.find(
      (f) => f.invitee.id === userId || f.inviter.id === userId,
    ) ?? null
  );
}

export function getFriendshipStatus(
  user: UserState,
  userId: number,
): FriendshipStatus {
  const friend = getFriend(user, userId);

  if (friend) return "friend";

  const friendRequest = getFriendRequest(user, userId);

  if (!friendRequest) return "none";

  if (friendRequest.inviter.id === user.id) return "requested";

  if (friendRequest.invitee.id === user.id) return "pending";

  return "none";
}

export const getWordForm = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (
    count === 0 ||
    (lastTwoDigits >= 10 && lastTwoDigits <= 20) ||
    lastDigit === 0 ||
    lastDigit >= 5
  ) {
    return "gier";
  } else if (lastDigit === 1) {
    return "gra";
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return "gry";
  }
};
