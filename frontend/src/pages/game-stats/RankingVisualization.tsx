import styles from "./Stats.module.scss";

const RankingVisualization = () => {
  const rankingData = [
    { place: "II Miejsce", count: 120, unit: "gier", percentage: 21.3 },
    { place: "I Miejsce", count: 120, unit: "gier", percentage: 70.1 },
    { place: "III Miejsce", count: 52, unit: "gry", percentage: 8.6 },
  ];

  return (
    <div className={styles.container}>
      {rankingData.map((item, index) => (
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
