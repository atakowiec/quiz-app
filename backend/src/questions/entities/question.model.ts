import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Category } from "./category.model";
import { Distractor } from "./distractor.model";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  question: string;

  @Column({ nullable: true })
  photo?: string;

  @Column()
  correctAnswer: string;

  @OneToMany(() => Distractor, (answer) => answer.question, {
    cascade: true,
  })
  distractors: Distractor[];

  @ManyToMany(() => Category, (category) => category.questions, {
    cascade: true,
  })
  @JoinTable()
  category: Category[];

  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
