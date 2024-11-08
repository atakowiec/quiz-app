import { RankingPlace } from "@shared/game";
import styles from "./Stats.module.scss";

interface RankingVisualizationProps {
  rankingData: RankingPlace[];
}

const getWordForm = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (
    count === 0 ||
    (lastTwoDigits >= 10 && lastTwoDigits <= 20) ||
    lastDigit === 0 ||
    lastDigit >= 5
  ) {
    return "gier";
  } else if (lastDigit === 1) {
    return "gra";
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return "gry";
  }
};

const RankingVisualization: React.FC<RankingVisualizationProps> = ({
  rankingData,
}) => {
  return (
    <div className={styles.container}>
      {rankingData?.map((item, index) => (
        <div key={index} className={styles.rankItem}>
          <div
            className={`${styles.rankBar} ${
              index === 0
                ? styles.secondPlace
                : index === 1
                  ? styles.firstPlace
                  : styles.thirdPlace
            }`}
          >
            <div className={styles.count}>
              {item.count} {getWordForm(item.count)}
            </div>
            <div className={styles.percentage}>{item.percentage}%</div>
          </div>
          <div className={styles.place}>{item.place}</div>
        </div>
      ))}
    </div>
  );
};

export default RankingVisualization;
