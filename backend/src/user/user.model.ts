import { UserGame } from "src/game/entities/usergame.model";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

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

  @Column()
  iconColor: string;

  @Column()
  permission: number;

  @Column({ default: true })
  acvite: boolean;

  @OneToMany(() => UserGame, (userGame) => userGame.user)
  userGames: UserGame[];
}
