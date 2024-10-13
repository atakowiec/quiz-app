import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/user.model";

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({name: "user_1"})
  user_1: User

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({name: "user_2"})
  user_2: User

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  since: Date;
}
