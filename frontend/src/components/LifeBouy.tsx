import React from "react";
import { IconType } from "react-icons";
import styles from "../styles/LifeBouy.module.scss";

interface LifeBouyProps {
  icon: IconType;
  executeAction?: () => void;
}

const LifeBouy: React.FC<LifeBouyProps> = ({ icon: Icon, executeAction }) => {
  return (
    <div className={styles.lifeBouyContainer} onClick={executeAction}>
      <Icon className={styles.lifeBouyIcon} />
    </div>
  );
};

export default LifeBouy;
