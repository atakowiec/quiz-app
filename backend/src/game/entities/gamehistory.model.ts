import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UserGame } from "./usergame.model";

@Entity()
export class GameHistory {
  @PrimaryColumn()
  id: string;

  @Column()
  gameType: string;

  @Column()
  dateTime: Date;

  @OneToMany(() => UserGame, (userGame) => userGame.game)
  userGames: UserGame[];
}
