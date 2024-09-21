import React, { useEffect, useState } from "react";
import Meta from "../components/Meta";
import { Breadcrumb, Container } from "react-bootstrap";
import styles from "../styles/Question.module.scss";
import LifeBouy from "../components/LifeBouy";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineMoreTime } from "react-icons/md";
import { MdQueryStats } from "react-icons/md";
import TimeBar from "../components/TimeBar";

const Question: React.FC = () => {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const totalTime = 60000;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 100);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  //TODO: make question a component
  //TODO: make answers show correct/incorrect after choice, show what players chose
  //TODO: add timer
  return (
    <>
      <Meta title={"Question"} />
      <Breadcrumb title="Question" />
      <TimeBar timeElapsed={timeElapsed} totalTime={totalTime} />{" "}
      <div className={styles.lifebouys}>
        <LifeBouy icon={FaRegEye} />
        <LifeBouy icon={MdOutlineMoreTime} />
        <LifeBouy icon={MdQueryStats} />
      </div>
      <Container className={styles.mainContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.mainBox}>
              <div className={styles.mainText}>Pytanie #iles</div>
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
