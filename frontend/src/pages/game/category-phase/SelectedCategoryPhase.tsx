import TimeBar from "../components/time-bar/TimeBar.tsx";
import { useGame } from "../../../store/gameSlice.ts";
import MainContainer from "../../../components/MainContainer.tsx";
import MainBox from "../../../components/MainBox.tsx";
import MainTitle from "../../../components/MainTitle.tsx";
import styles from "./Category.module.scss";

const SelectedCategoryPhase = () => {
  const game = useGame();

  if (game?.round?.category == null) return null;
  const history = game.answersHistory as boolean[];

  return (
    <div>
      <MainContainer>
        <MainBox>
          <MainTitle>Wybrana Kategoria</MainTitle>
          <div className={`${styles.categoryChosen}`}>
            <img
              className={styles.categoryChosenImage}
              src={"https://via.placeholder.com/250"}
              alt={game.round.category.name}
            />
            <div className={styles.categoryTitle}>
              {game.round.category.name}
            </div>
          </div>
          <div className={styles.circlesContainer}>
            {Array.from(
              { length: game.settings.number_of_questions_per_round },
              (_, i) => {
                const answered = history.length > i;

                const circleColor = answered
                  ? history[i]
                    ? "#06a53b" // Jeśli odpowiedź jest prawidłowa
                    : "#ff4949" // Jeśli odpowiedź jest błędna
                  : "#f0f4f"; // Jeśli pytanie nie zostało odpowiedziane

                return (
                  <div
                    key={i}
                    className={styles.voteCircle}
                    style={{
                      backgroundColor: answered ? circleColor : "#f0f4f",
                      border: `2px solid ${answered ? circleColor : "#9999"}`,
                    }}
                  />
                );
              }
            )}
          </div>
        </MainBox>
      </MainContainer>
      <TimeBar />
    </div>
  );
};

export default SelectedCategoryPhase;
