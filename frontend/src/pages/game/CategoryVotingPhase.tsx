import Meta from "../../components/Meta.tsx";
import { Breadcrumb, Container } from "react-bootstrap";
import styles from "../../styles/Category.module.scss";
import TimeBar from "../../components/TimeBar.tsx";
import React from "react";
import { useGame } from "../../store/gameSlice.ts";
import SingleCategory from "./SingleCategory.tsx";

const CategoryVotingPhase: React.FC = () => {
  const game = useGame();
  if(!game?.round?.categories) {
    return
  }

  return (
    <div>
      <Meta title={"Question"} />
      <Breadcrumb title="Question" />
      <TimeBar />{" "}
      <Container className={styles.mainContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.mainBox}>
              <div className={styles.mainText}>Wybór kategorii</div>
              <div className={styles.categoryChoiceBox}>
                {game.round.categories.map((categoryId) => (
                  <SingleCategory categoryId={categoryId} key={categoryId} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryVotingPhase;
