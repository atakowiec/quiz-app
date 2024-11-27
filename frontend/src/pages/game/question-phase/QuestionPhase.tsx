import Meta from "../../../components/Meta.tsx";
import { Breadcrumb } from "react-bootstrap";
import styles from "./Question.module.scss";
import Helper from "../components/helper/Helper.tsx";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineMoreTime } from "react-icons/md";
import { MdQueryStats } from "react-icons/md";
import TimeBar from "../components/time-bar/TimeBar.tsx";
import { useGame } from "../../../store/gameSlice.ts";
import { useSocket } from "../../../socket/useSocket.ts";
import { HelperType, IQuestion } from "@shared/game";
import MainContainer from "../../../components/MainContainer.tsx";
import MainBox from "../../../components/MainBox.tsx";
import MainTitle from "../../../components/MainTitle.tsx";
import ProfileIcon from "../../../components/ProfileIcon.tsx";

const helperIcons = {
  cheat_from_others: FaRegEye,
  extend_time: MdOutlineMoreTime,
  fifty_fifty: MdQueryStats,
};

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

  const blackListedHelpers = game.settings.blackListedHelpers || [];
  const availableHelpers = game.player.availableHelpers.filter(
    (helper: HelperType) => !blackListedHelpers.includes(helper)
  );

  return (
    <>
      <Meta title={"Pytanie"} />
      <Breadcrumb title="Pytanie" />
      <MainContainer className={styles.mainContainer}>
        <div className={styles.lifebouys}>
          {availableHelpers.map((helper: HelperType) => {
            const IconComponent = helperIcons[helper];
            const helperDescriptions = {
              cheat_from_others: "Podejrzyj odpowiedzi innych graczy",
              extend_time: "Przedłuż czas na odpowiedź",
              fifty_fifty: "Eliminuj dwie błędne odpowiedzi",
            };
            return (
              <Helper
                key={helper}
                icon={IconComponent}
                executeAction={() => executeHelper(helper)}
                description={helperDescriptions[helper]}
              />
            );
          })}
        </div>
        <div className={styles.boxWithTimebar}>
          <MainBox before={<TimeBar />}>
            <MainTitle>Pytanie #{game.round.questionNumber}</MainTitle>
            <div className={styles.question}>
              {game.round.question.text}
              <QuestionImage question={game.round.question} />
            </div>
            <div className={styles.answersBox}>
              {game.round.question.answers.map((answer) => {
                const isHidden = game.player.hiddenAnswers.includes(answer);
                const isSelected = selected === answer;
                const isCorrect = game?.round?.correctAnswer === answer;
                const playersChosen =
                  game?.players?.filter(
                    (player) => player.chosenAnswer === answer
                  ) ?? [];

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

                const maxDisplayedPlayers = 5;
                const extraPlayers =
                  playersChosen.length > maxDisplayedPlayers
                    ? playersChosen.length - maxDisplayedPlayers
                    : 0;

                return (
                  <div
                    className={`${styles.answerBox} ${className}`}
                    key={answer}
                    onClick={() => selectAnswer(answer)}
                  >
                    {answer}
                    {playersChosen.length > 0 && (
                      <div className={styles.voteIcons}>
                        {playersChosen
                          .slice(0, maxDisplayedPlayers)
                          .map((player) => (
                            <ProfileIcon
                              key={player.username}
                              className={styles.voteCircle}
                              username={player.username}
                              iconColor={player.iconColor}
                            />
                          ))}
                        {extraPlayers > 0 && (
                          <span className={styles.extraVotes}>
                            +{extraPlayers}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </MainBox>
        </div>
      </MainContainer>
    </>
  );
};

function QuestionImage({ question }: { question: IQuestion }) {
  if (!question.photo) return null;

  return (
    <button className={styles.imageWrapper}>
      <img
        src={question.photo}
        alt={question.text}
        className={`${styles.questionImage}`}
      />
    </button>
  );
}

export default QuestionPhase;
