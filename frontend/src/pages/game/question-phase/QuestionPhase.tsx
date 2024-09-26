import Meta from "../../../components/Meta.tsx";
import { Breadcrumb, Container } from "react-bootstrap";
import styles from "./Question.module.scss";
import Helper from "../components/helper/Helper.tsx";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineMoreTime } from "react-icons/md";
import { MdQueryStats } from "react-icons/md";
import TimeBar from "../components/time-bar/TimeBar.tsx";
import { useGame } from "../../../store/gameSlice.ts";
import { useSocket } from "../../../socket/useSocket.ts";
import { HelperType } from "@shared/game";

const QuestionPhase = () => {
  const game = useGame();
  const socket = useSocket();

  if (!game?.round?.question) return null;

  const resultShown = game.status === "question_result_phase";
  const selected = game.player.chosenAnswer;

  function selectAnswer(answer: string) {
    if (game?.status !== "question_phase" || game?.player.chosenAnswer) return;

    socket.emit("select_answer", answer);
  }

  function executeHelper(helper: HelperType) {
    if (game?.status !== "question_phase") return;

    socket.emit("use_helper", helper);
  }

  //TODO: make question a component
  //TODO: make answers show correct/incorrect after choice, show what players chose
  //TODO: add timer
  return (
    <>
      <Meta title={"Question"} />
      <Breadcrumb title="Question" />
      <Container className={styles.mainContainer}>
        <div className={styles.lifebouys}>
          <Helper
            icon={FaRegEye}
            executeAction={() => executeHelper("cheat_from_others")}
          />
          <Helper
            icon={MdOutlineMoreTime}
            executeAction={() => executeHelper("extend_time")}
          />
          <Helper
            icon={MdQueryStats}
            executeAction={() => executeHelper("fifty_fifty")}
          />
        </div>
        <TimeBar />{" "}
        <div className="row justify-content-center">
          <div className={styles.mainBox}>
            <div className={styles.mainText}>
              Pytanie #{game.round.questionNumber}
            </div>
            <div className={styles.question}>
              {" "}
              {game.round.question.text}{" "}
              {game.round.question.photo && (
                <img
                  src={game.round.question.photo}
                  alt={game.round.question.text}
                  className={styles.questionImage}
                />
              )}
            </div>
            <div className={styles.answersBox}>
              {game.round.question.answers.map((answer) => {
                const isHidden = game.player.hiddenAnswers.includes(answer);
                const isSelected = selected === answer;
                const isCorrect = game?.round?.correctAnswer === answer;
                const playersChosen = game?.players?.filter(
                  (player) => player.chosenAnswer === answer
                );
                const className = resultShown
                  ? isCorrect
                    ? styles.correctAnswer
                    : isSelected
                      ? styles.incorrectAnswer
                      : ""
                  : isSelected
                    ? styles.selected
                    : isHidden
                      ? styles.hiddenAnswer
                      : "";
                const playersThatAnswered = !resultShown
                  ? []
                  : game?.players
                      ?.filter((player) => player.chosenAnswer === answer)
                      .map((player) => player.username);

                return (
                  <div
                    className={`${styles.answerBox} ${className}`}
                    key={answer}
                    onClick={() => selectAnswer(answer)}
                  >
                    {answer}
                    {playersThatAnswered && (
                      <div>{playersThatAnswered.join(", ")}</div>
                    )}
                    {game?.player?.showOtherPlayersAnswers && playersChosen && (
                      <div className={styles.cheatedAnswers}>
                        {playersChosen
                          .filter(
                            (player) => player.username !== game.player.username
                          )
                          .map((player) => (
                            <span
                              className={styles.userAnswer}
                              key={player.username}
                            >
                              {player.username}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default QuestionPhase;
