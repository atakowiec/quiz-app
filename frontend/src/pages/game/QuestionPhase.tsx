import Meta from "../../components/Meta.tsx";
import { Breadcrumb, Container } from "react-bootstrap";
import styles from "../../styles/Question.module.scss";
import LifeBouy from "../../components/LifeBouy.tsx";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineMoreTime } from "react-icons/md";
import { MdQueryStats } from "react-icons/md";
import TimeBar from "../../components/TimeBar.tsx";
import { useGame } from "../../store/gameSlice.ts";
import { useSocket } from "../../socket/useSocket.ts";

const QuestionPhase = () => {
  const game = useGame();
  const socket = useSocket();

  if (!game?.round?.question)
    return null;

  const resultShown = game.status === "question_result_phase";
  const selected = game.player.chosenAnswer;

  function selectAnswer(answer: string) {
    if(game?.status !== "question_phase" || game?.player.chosenAnswer)
      return

    socket.emit("select_answer", answer);
  }

  //TODO: make question a component
  //TODO: make answers show correct/incorrect after choice, show what players chose
  //TODO: add timer
  return (
    <>
      <Meta title={"Question"}/>
      <Breadcrumb title="Question"/>
      <TimeBar/>{" "}
      <div className={styles.lifebouys}>
        <LifeBouy icon={FaRegEye}/>
        <LifeBouy icon={MdOutlineMoreTime}/>
        <LifeBouy icon={MdQueryStats}/>
      </div>
      <Container className={styles.mainContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.mainBox}>
              <div className={styles.mainText}>Pytanie #{game.round.questionNumber}</div>
              <div className={styles.question}> {game.round.question.text} </div>
              <div className={styles.answersBox}>
                {game.round.question.answers.map((answer) => {
                  const isSelected = selected === answer;
                  const isCorrect = game?.round?.correctAnswer === answer;
                  const className = resultShown ? (isCorrect ? styles.correctAnswer : isSelected ? styles.incorrectAnswer : '') : isSelected ? styles.selected : '';
                  const playersThatAnswered = !resultShown ? [] : game?.players?.filter(player => player.chosenAnswer === answer).map(player => player.username);

                  return (
                    <div className={`${styles.answerBox} ${className}`} key={answer}
                         onClick={() => selectAnswer(answer)}>
                      {answer}
                      {playersThatAnswered && (
                        <div>
                          {playersThatAnswered.join(", ")}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default QuestionPhase;
