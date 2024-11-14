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
import { HelperType } from "@shared/game";
import MainContainer from "../../../components/MainContainer.tsx";
import MainBox from "../../../components/MainBox.tsx";
import MainTitle from "../../../components/MainTitle.tsx";

// Generowanie unikalnej palety kolorów dla każdej kategorii
function generateColors(numberOfCategories: number) {
  const colors = [];
  for (let i = 0; i < numberOfCategories * 5; i++) {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    colors.push(color);
  }
  return colors;
}

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

  const numberOfCategories = game.round.question.answers.length; // Liczba kategorii/pytania
  const colors = generateColors(numberOfCategories); // Generowanie kolorów

  function selectAnswer(answer: string) {
    if (game?.status !== "question_phase" || game?.player.chosenAnswer) return;

    socket.emit("select_answer", answer);
  }

  function executeHelper(helper: HelperType) {
    if (game?.status !== "question_phase") return;

    socket.emit("use_helper", helper);
  }

  const blackListedHelpers = game.settings.blackListedHelpers || [];
  // Filtrujemy tylko dostępne koła ratunkowe na podstawie availableHelpers
  const availableHelpers = game.player.availableHelpers.filter(
    (helper: HelperType) => !blackListedHelpers.includes(helper)
  );

  return (
    <>
      <Meta title={"Question"} />
      <Breadcrumb title="Question" />
      <MainContainer>
        <div className={styles.lifebouys}>
          {availableHelpers.map((helper: HelperType) => {
            const IconComponent = helperIcons[helper]; // Pobranie odpowiedniej ikony na podstawie helpera
            return (
              <Helper
                key={helper}
                icon={IconComponent} // Ustawienie ikony dla danego koła ratunkowego
                executeAction={() => executeHelper(helper)} // Akcja po kliknięciu
              />
            );
          })}
        </div>
        <MainBox before={<TimeBar />}>
          <MainTitle>Pytanie #{game.round.questionNumber}</MainTitle>
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
            {game.round.question.answers.map((answer, answerIndex) => {
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
                        .map((player, playerIndex) => (
                          <div
                            key={player.username}
                            className={styles.voteCircle}
                            style={{
                              backgroundColor:
                                colors[answerIndex * 5 + playerIndex], // Kolor przypisany na podstawie kategorii i indeksu gracza
                            }}
                          >
                            <span className={styles.playerIcon}>
                              {player.username
                                ? player.username[0].toUpperCase()
                                : "?"}{" "}
                            </span>
                          </div>
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
      </MainContainer>
    </>
  );
};

export default QuestionPhase;
