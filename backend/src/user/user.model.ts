import { UserGame } from "src/game/entities/usergame.model";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({
    default: "#5596ca",
  })
  iconColor: string;

  @Column()
  permission: number;

  @Column({ default: true })
  activate: boolean;

  @OneToMany(() => UserGame, (userGame) => userGame.user)
  userGames: UserGame[];
}
