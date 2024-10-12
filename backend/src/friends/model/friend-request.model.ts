import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../../user/user.model";
import { INotification } from "@shared/notifications";

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({name: "inviter"})
  inviter: User

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({name: "invitee"})
  invitee: User

  @CreateDateColumn()
  date: Date;

  public toINotification(): INotification {
    return {
      id: `FR-${this.id.toString()}`,
      type: "friend_request",
      inviter: {
        id: this.inviter.id,
        username: this.inviter.username,
      },
      invitee: {
        id: this.invitee.id,
        username: this.invitee.username,
      },
      createdAt: this.date,
    };
  }
}
