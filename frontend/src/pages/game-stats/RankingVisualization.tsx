import { RankingPlace } from "@shared/game";
import styles from "./Stats.module.scss";
import { getWordForm } from "../../utils/utils.ts";
import { FC } from "react";

interface RankingVisualizationProps {
  rankingData: RankingPlace[];
  className?: string;
}

const RankingVisualization: FC<RankingVisualizationProps> = ({
  rankingData,
  className,
}) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>
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
              {item.count || 0} {getWordForm(item.count)}
            </div>
            <div className={styles.percentage}>
              {(item.percentage * 100).toFixed(0) || 0}%
            </div>
          </div>
          <div className={styles.place}>{item.place}</div>
        </div>
      ))}
    </div>
  );
};

export default RankingVisualization;
