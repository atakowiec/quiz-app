import { RankingPlace } from "@shared/game";
import styles from "./Stats.module.scss";
interface RankingVisualizationProps {
  rankingData: RankingPlace[];
}

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
              {item.count} {item.unit}
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
