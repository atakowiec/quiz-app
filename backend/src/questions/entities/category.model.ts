import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Question } from "./question.model";
import {ICategory as ICategory} from "@shared/game";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  img: string;

  @ManyToMany(() => Question, (question) => question.category)
  questions: Question[];

  public toICategory(): ICategory {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      img: this.img,
    }
  }
}
