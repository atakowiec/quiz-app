import { User } from "src/user/user.model";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { GameHistory } from "./gamehistory.model";
import { UserGameCategoryScore } from "./usergamecategoryscore.model";

@Entity()
export class UserGame {
  @PrimaryColumn()
  gameId: string;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.userGames)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => GameHistory, (game) => game.userGames)
  @JoinColumn({ name: "gameId" })
  game: GameHistory;

  @Column()
  score: number;

  @Column()
  place: number;

  @OneToMany(
    () => UserGameCategoryScore,
    (categoryScore) => categoryScore.userGame
  )
  categoryScores: UserGameCategoryScore[];
}
