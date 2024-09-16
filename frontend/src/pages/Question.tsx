import React from "react";
import Meta from "../components/Meta";
import { Breadcrumb, Container } from "react-bootstrap";
import styles from "../styles/Question.module.scss";
import LifeBouy from "../components/LifeBouy";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineMoreTime } from "react-icons/md";
import { MdQueryStats } from "react-icons/md";

const Question = () => {
  return (
    <>
      <Meta title={"Question"} />
      <Breadcrumb title="Question" />
      <div className={styles.lifebouys}>
        <LifeBouy icon={FaRegEye} />
        <LifeBouy icon={MdOutlineMoreTime} />
        <LifeBouy icon={MdQueryStats} />
      </div>
      <Container className={styles.questionContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.questionBox}>
              <div className={styles.questionText}>Pytanie #iles</div>
              <div className={styles.question}> Jakieś pytanie? </div>
              <div className={styles.answersBox}>
                <div className={styles.answerBox}>Odpowiedz #1</div>
                <div className={styles.answerBox}>Odpowiedz #2</div>
                <div className={styles.answerBox}>Odpowiedz #3</div>
                <div className={styles.answerBox}>Odpowiedz #4</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Question;
