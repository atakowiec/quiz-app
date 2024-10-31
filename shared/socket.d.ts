import {
  CategoryId,
  GameSettings,
  GameUpdatePacket,
  HelperType,
  IGamePacket,
} from "./game";
import { UserStatus } from "./user";
import { INotification } from "./notifications";
import { Friend, IFriendRequest } from "./friends";

export interface ServerToClientEvents {
  send_message: (message: string) => void;
  notification: (message: string) => void;
  exception: (message: string | any) => void;
  set_game: (game: IGamePacket) => void;
  update_game: (game: GameUpdatePacket) => void;

  new_notification: (notification: INotification) => void;
  set_notifications: (notification: INotification[]) => void;
  remove_notification: (notificationId: string) => void;

  set_friends: (friends: Friend[]) => void;
  new_friend: (friend: Friend) => void;
  update_friend_status: (friendId: number, newStatus: UserStatus) => void;
  remove_friend: (friendId: number) => void;

  set_friend_requests: (friendRequests: IFriendRequest[]) => void;
  new_friend_request: (friendRequest: IFriendRequest) => void;
  remove_friend_request: (friendRequestId: string) => void;
  game_joined: () => void;
}

export type ServerToClientEventsKeys = keyof ServerToClientEvents;

export interface ClientToServerEvents {
  create_game: (gameMode: string, cb: () => void) => void;
  join_queue: (cb: (response: string) => void) => void;
  join_game: (gameId: string, cb: () => void) => void;
  leave_game: () => void;
  leave_queue: (cb: (response: number) => void) => void;
  kick: (username: string) => void;
  give_owner: (username: string) => void;
  start_game: () => void;
  select_category: (categoryId: number) => void;
  select_answer: (answer: string) => void;
  use_helper: (helperName: string) => void;
  change_settings: (settings: Partial<GameSettings>) => void;
  change_settings_helpers: (blackListedHelpers: HelperType[]) => void;
  change_settings_categories: (whiteListedCategories: CategoryId[]) => void;
  invite_friend: (userId: number) => void;
  remove_friend: (userId: number) => void;
  cancel_friend_request: (userId: number) => void;
  decline_notification: (notification: INotification) => void;
  send_game_invite: (userId: number) => void;
  play_again: (cb: () => void) => void;
}

export type ClientToServerEventsKeys = keyof ClientToServerEvents;
