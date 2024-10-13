import { UserStatus } from "./user";
import { INotification } from "./notifications";

export type Friend = {
  id: number;
  username: string;
  status: UserStatus;
}

export type IFriendRequest = INotification;