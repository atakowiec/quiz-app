import React, { useEffect, useState } from "react";
import styles from "./TimeBar.module.scss";
import { useGame } from "../../../../store/gameSlice.ts";

interface TimeBarProps {
  startTime?: number;
  endTime?: number;
  className?: string;
}

const TimeBar: React.FC<TimeBarProps> = ({ startTime, endTime }) => {
  const game = useGame();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    let start = startTime ?? game?.timer?.start;
    let end = endTime ?? game?.timer?.end;

    if (!start || !end) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - start;
      const totalTime = end - start;

      setPercentage((timeElapsed / totalTime) * 100);

      if (timeElapsed >= totalTime) {
        setPercentage(100);
        clearInterval(interval);
        return;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    startTime,
    endTime,
    game?.timer?.start ?? 0,
    game?.timer?.end ?? 0,
  ]);

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
