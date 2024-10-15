import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserGame } from "./usergame.model";
import { Category } from "src/questions/entities/category.model";

@Entity()
export class UserGameCategoryScore {
  @PrimaryColumn()
  userGameGameId: string;

  @PrimaryColumn()
  userGameUserId: number;

  @PrimaryColumn()
  categoryId: number;

  @ManyToOne(() => UserGame, (userGame) => userGame.categoryScores)
  @JoinColumn([
    { name: "userGameGameId", referencedColumnName: "gameId" },
    { name: "userGameUserId", referencedColumnName: "userId" },
  ])
  userGame: UserGame;

  @ManyToOne(() => Category, (category) => category)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column()
  score: number;
}
