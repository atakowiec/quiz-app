import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Question } from "./question.model";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Question, (question) => question.category)
  questions: Question[];
}
