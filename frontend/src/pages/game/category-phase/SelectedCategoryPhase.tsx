import { useGame } from "../../../store/gameSlice.ts";
import MainContainer from "../../../components/main-components/MainContainer.tsx";
import MainBox from "../../../components/main-components/MainBox.tsx";
import MainTitle from "../../../components/main-components/MainTitle.tsx";
import styles from "./Category.module.scss";
import Meta from "../../../components/main-components/Meta.tsx";
import { Breadcrumb } from "react-bootstrap";

const SelectedCategoryPhase = () => {
  const game = useGame();

  if (game?.round?.category == null) return null;
  const history = game.answersHistory as boolean[];

  return (
    <div>
      <Meta title={"Kategoria"} />
      <Breadcrumb title="Kategoria" />
      <MainContainer>
        <MainBox>
          <MainTitle>Wybrana Kategoria</MainTitle>
          <div className={`${styles.categoryChosen}`}>
            <img
              className={styles.categoryChosenImage}
              src={game.round.category.img}
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
    </div>
  );
};

export default SelectedCategoryPhase;
