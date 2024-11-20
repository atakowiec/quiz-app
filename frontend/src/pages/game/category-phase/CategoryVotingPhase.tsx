import Meta from "../../../components/Meta.tsx";
import { Breadcrumb } from "react-bootstrap";
import styles from "./Category.module.scss";
import TimeBar from "../components/time-bar/TimeBar.tsx";
import { useGame } from "../../../store/gameSlice.ts";
import SingleCategory from "./SingleCategory.tsx";
import MainContainer from "../../../components/MainContainer.tsx";
import MainBox from "../../../components/MainBox.tsx";
import MainTitle from "../../../components/MainTitle.tsx";

const CategoryVotingPhase: React.FC = () => {
  const game = useGame();
  if (!game?.round?.categories) {
    return;
  }

  return (
    <div>
      <Meta title={"Question"} />
      <Breadcrumb title="Question" />
      <MainContainer className={styles.categoryVotingBox}>
        <div className={styles.boxWithTimebar}>
          <MainBox className={styles.mainBox} before={<TimeBar />}>
            <MainTitle>Wybór kategorii</MainTitle>
            <div
              className={`${styles.categoryChoiceBox} row row-cols-2 row-cols-md-4 row-cols-xxl-6`}
            >
              {game.round.categories.map((categoryId) => (
                <SingleCategory categoryId={categoryId} key={categoryId} />
              ))}
            </div>
          </MainBox>
        </div>
      </MainContainer>
    </div>
  );
};

export default CategoryVotingPhase;
