import {
  CategoryId,
  GameSettings,
  GameUpdatePacket,
  HelperType,
  IGamePacket,
} from "./game";
import { FriendshipStatus } from "./user";
import { INotification } from "./notifications";

export interface ServerToClientEvents {
  send_message: (message: string) => void;
  notification: (message: string) => void;
  exception: (message: string | object) => void;
  set_game: (game: IGamePacket) => void;
  update_game: (game: GameUpdatePacket) => void;
  new_notification: (notification: INotification) => void;
  set_notifications: (notification: INotification[]) => void;
  remove_notification: (notificationId: string) => void;
}

export type ServerToClientEventsKeys = keyof ServerToClientEvents;

export interface ClientToServerEvents {
  create_game: (gameMode: string, cb: () => void) => void;
  join_queue: (gameMode: string, cb: () => void) => void;
  join_game: (gameId: string, cb: () => void) => void;
  leave_game: () => void;
  kick: (username: string) => void;
  give_owner: (username: string) => void;
  start_game: () => void;
  select_category: (categoryId: number) => void;
  select_answer: (answer: string) => void;
  use_helper: (helperName: string) => void;
  change_settings: (settings: Partial<GameSettings>) => void;
  change_settings_helpers: (blackListedHelpers: HelperType[]) => void;
  change_settings_categories: (whiteListedCategories: CategoryId[]) => void;
  invite_friend: (userId: number, cb?: (newStatus: FriendshipStatus) => void) => void;
  remove_friend: (userId: number, cb: (newStatus: FriendshipStatus) => void) => void;
  cancel_friend_request: (userId: number, cb: (newStatus: FriendshipStatus) => void) => void;
  decline_notification: (notification: INotification) => void;
  send_game_invite: (userId: number) => void;
}

export type ClientToServerEventsKeys = keyof ClientToServerEvents;
