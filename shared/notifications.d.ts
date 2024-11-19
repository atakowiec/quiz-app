export type NotificationType = "game_invite" | "friend_request";

export type NotificationUser = {
  id: number;
  username: string;
  iconColor: string;
}

export type INotification = {
  id: string;
  type: NotificationType;
  createdAt: Date;
  inviter: NotificationUser;
  invitee: NotificationUser;
};

export type GameInviteNotification = INotification & {
  gameId: string;
};
