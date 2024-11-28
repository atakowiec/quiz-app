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
import { HelperType, IAnswer, IQuestion } from "@shared/game";
import MainContainer from "../../../components/MainContainer.tsx";
import MainBox from "../../../components/MainBox.tsx";
import MainTitle from "../../../components/MainTitle.tsx";
import ProfileIcon from "../../../components/ProfileIcon.tsx";
import { useEffect, useState } from "react";

const helperIcons = {
  cheat_from_others: FaRegEye,
  extend_time: MdOutlineMoreTime,
  fifty_fifty: MdQueryStats,
};

const helperDescriptions = {
  cheat_from_others: "Podejrzyj odpowiedzi innych graczy",
  extend_time: "Przedłuż czas na odpowiedź",
  fifty_fifty: "Eliminuj dwie błędne odpowiedzi",
};

const QuestionPhase = () => {
  const game = useGame();
  const socket = useSocket();

  if (!game?.round?.question) return null;

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
      <Meta title={"Pytanie"}/>
      <Breadcrumb title="Pytanie"/>
      <MainContainer className={styles.mainContainer}>
        <div className={styles.lifebouys}>
          {availableHelpers.map((helper: HelperType) => (
            <Helper
              key={helper}
              icon={helperIcons[helper]}
              executeAction={() => executeHelper(helper)}
              description={helperDescriptions[helper]}
            />
          ))}
        </div>
        <div className={styles.boxWithTimebar}>
          <MainBox before={<TimeBar/>}>
            <MainTitle>Pytanie #{game.round.questionNumber}</MainTitle>
            <div className={styles.question}>
              {game.round.question.text}
              <QuestionImage question={game.round.question}/>
            </div>
            <div className={styles.answersBox}>
              {game.round.question.answers.map((answer, i) =>
                <Answer answer={answer} index={i} key={`${i}${answer}`}/>)}
            </div>
          </MainBox>
        </div>
      </MainContainer>
      {/* <LeaveGameButton /> */}
    </>
  );
};

function Answer({ answer, index }: { answer: IAnswer, index: number }) {
  const game = useGame()!;
  const socket = useSocket();
  const [fadeIn, setFadeIn] = useState(false);

  const resultShown = game.status === "question_result_phase";
  const selected = game.player.chosenAnswer;
  const isHidden = game.player.hiddenAnswers.includes(answer);
  const isSelected = selected === answer;
  const isCorrect = game?.round?.correctAnswer === answer;
  const playersChosen =
    game?.players?.filter((player) => player.chosenAnswer === answer) ?? [];

  const maxDisplayedPlayers = 5;
  const extraPlayers =
    playersChosen.length > maxDisplayedPlayers
      ? playersChosen.length - maxDisplayedPlayers
      : 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeIn(true);
    }, 300 + 100 * index);

    return () => clearTimeout(timeout);
  }, []);

  // determine class name of the answer based on the state
  let className: any;

  if (resultShown) {
    if (isCorrect) {
      className = styles.correctAnswer;
    } else {
      className = isSelected ? styles.incorrectAnswer : "";
    }
  } else {
    if (!isSelected) {
      className = isHidden ? styles.hiddenAnswer : "";
    } else {
      className = styles.selected;
    }
  }

  function selectAnswer() {
    if (game?.status !== "question_phase" || game?.player.chosenAnswer) return;

    socket.emit("select_answer", answer);
  }

  return (
    <div className={`${styles.answerBox} ${className}`} onClick={selectAnswer} style={{ opacity: fadeIn ? 1 : 0 }}>
      <span>
        {answer}
      </span>
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
}

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
