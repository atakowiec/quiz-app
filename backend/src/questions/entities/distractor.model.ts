import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {Question} from "./question.model";

@Entity()
export class Distractor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Question, question => question.distractors)
  question: Question;
}