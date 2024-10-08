import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../../user/user.model";

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
}
