import { User } from "../../user/user.model";
import { nanoid } from "nanoid";
import { INotification, NotificationType } from "@shared/notifications";

export default class Notification {
  public readonly id: string = nanoid(12);
  public readonly createdAt: Date = new Date();

  constructor(
    public readonly type: NotificationType,
    public readonly inviter: User,
    public readonly invitee: User,
  ) {
    // empty
  }

  toINotification(): INotification {
    return {
      id: this.id,
      type: this.type,
      inviter: {
        id: this.inviter.id,
        username: this.inviter.username,
      },
      invitee: {
        id: this.invitee.id,
        username: this.invitee.username
      },
      createdAt: this.createdAt,
    };
  }
}