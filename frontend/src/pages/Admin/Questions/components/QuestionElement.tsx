import React from "react";
import classes from "./styles/questionElement.module.scss";
import { Distractor } from "../Questions";

export interface QuestionElementProps {
  question: string;
  correctAnswer: string;
  distractors: Distractor[];
}
export default function QuestionElement(props: QuestionElementProps) {
  return (
    <li className={classes.container}>
      <span className={classes.question}>{props.question}</span>
      <span className={classes.correctAnswer}>{props.correctAnswer}</span>
      <div className={classes.distractors}>
        {props.distractors.map((distractor) => (
          <span key={distractor.id} className={classes.distractor}>
            {distractor.content}
          </span>
        ))}
      </div>
    </li>
  );
}
