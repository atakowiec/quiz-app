import React from "react";
import styles from "../styles/TimeBar.module.scss";

interface TimeBarProps {
  timeElapsed: number;
  totalTime: number;
}

const TimeBar: React.FC<TimeBarProps> = ({ timeElapsed, totalTime }) => {
  const percentage = (timeElapsed / totalTime) * 100;

  //TODO: fix position of the timebar
  return (
    <div className={styles.timeBarWrapper}>
      <div className={styles.timeBarContainer}>
        <div
          className={styles.timeBarFiller}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default TimeBar;
