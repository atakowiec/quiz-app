import Meta from "../../../components/main-components/Meta.tsx";
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
import MainContainer from "../../../components/main-components/MainContainer.tsx";
import MainBox from "../../../components/main-components/MainBox.tsx";
import MainTitle from "../../../components/main-components/MainTitle.tsx";
import ProfileIcon from "../../profile/components/ProfileIcon.tsx";
import { useEffect, useState } from "react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Fancybox from "./components/FancyBox.tsx";

const helperIcons = {
  cheat_from_others: FaRegEye,
  extend_time: MdOutlineMoreTime,
  fifty_fifty: MdQueryStats,
};

const helperDescriptions: {[key in HelperType]: string} = {
  cheat_from_others: "Podejrzyj odpowiedzi innych graczy",
  extend_time: "Przedłuż czas na odpowiedź",
  fifty_fifty: "Eliminuj dwie błędne odpowiedzi",
};

const QuestionPhase = () => {
  const game = useGame();

  if (!game?.round?.question) return null;

  return (
    <>
      <Meta title={"Pytanie"}/>
      <Breadcrumb title="Pytanie"/>
      <MainContainer className={styles.mainContainer}>
        <div className={styles.boxWithTimebar}>
          <MainBox before={<><Lifebouys/><TimeBar/></>}>
            <MainTitle>Pytanie #{game.round.questionNumber}</MainTitle>
            <div className={styles.question}>
              {game.round.question.text}
              <QuestionImage question={game.round.question}/>
            </div>
            <div className={styles.answersBox}>
              {game.round.question.answers.map((answer, i) => (
                <Answer answer={answer} index={i} key={`${i}${answer}`}/>
              ))}
            </div>
          </MainBox>
        </div>
      </MainContainer>
    </>
  );
};

function Lifebouys() {

  return (
    <div className={styles.lifebouys}>
      {(Object.keys(helperDescriptions) as HelperType[]).map((helper: HelperType) => (
        <Helper
          helper={helper}
          key={helper}
          icon={helperIcons[helper]}
          description={helperDescriptions[helper]}
        />
      ))}
    </div>
  )
}

function Answer({ answer, index }: { answer: IAnswer; index: number }) {
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
    const timeout = setTimeout(
      () => {
        setFadeIn(true);
      },
      300 + 100 * index
    );

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
    <div
      className={`${styles.answerBox} ${className}`}
      onClick={selectAnswer}
      style={{ opacity: fadeIn ? 1 : 0 }}
    >
      <span>{answer}</span>
      {playersChosen.length > 0 && (
        <div className={styles.voteIcons}>
          {playersChosen.slice(0, maxDisplayedPlayers).map((player) => (
            <ProfileIcon
              key={player.username}
              className={styles.voteCircle}
              username={player.username}
              iconColor={player.iconColor}
            />
          ))}
          {extraPlayers > 0 && (
            <span className={styles.extraVotes}>+{extraPlayers}</span>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionImage({ question }: { question: IQuestion }) {
  if (!question.photo) return null;

  return (
    <>
      <Fancybox>
        <a data-fancybox="gallery" href={question.photo}>
          <img
            src={question.photo}
            alt={question.text}
            className={`${styles.questionImage}`}
          />
        </a>
      </Fancybox>
    </>
  );
}

export default QuestionPhase;
