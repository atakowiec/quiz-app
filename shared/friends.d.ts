import { UserStatus } from "./user";
import { INotification } from "./notifications";

export type Friend = {
  id: number;
  username: string;
  status: UserStatus;
  iconColor: string;
}

export type IFriendRequest = INotification;