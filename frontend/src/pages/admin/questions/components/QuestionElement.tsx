import classes from "../styles/QuestionElement.module.scss";
import { Distractor } from "../Questions";
import styles from "../../categories/styles/Categories.module.scss";
import { IoIosPower } from "react-icons/io";

export interface QuestionElementProps {
  question: string;
  correctAnswer: string;
  distractors: Distractor[];
  isActive?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: (id: number) => void;
  id: number;
}

export default function QuestionElement(props: QuestionElementProps) {
  return (
    <li className={classes.container} onClick={props.onEditClick}>
      <span className={classes.question}>{props.question}</span>
      <span className={classes.correctAnswer}>{props.correctAnswer}</span>
      <div className={classes.distractors}>
        {props.distractors.map((distractor) => (
          <span key={distractor.id} className={classes.distractor}>
            {distractor.content}
          </span>
        ))}
      </div>
      {props.onDeleteClick && (
        <IoIosPower
          className={styles.icon}
          title="Zmień status"
          style={{
            color: props.isActive ? "lightgreen" : "red",
            minWidth: "2.2rem",
            minHeight: "2.2rem",
          }}
          onClick={(e) => {
            e.stopPropagation();
            props.onDeleteClick?.(props.id);
          }}
        />
      )}
    </li>
  );
}
