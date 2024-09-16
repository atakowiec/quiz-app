import React from "react";
import { IconType } from "react-icons";
import styles from "../styles/LifeBouy.module.scss";

interface LifeBouyProps {
  icon: IconType;
}

const LifeBouy: React.FC<LifeBouyProps> = ({ icon: Icon }) => {
  return (
    <div className={styles.lifeBouyContainer}>
      <Icon className={styles.lifeBouyIcon} />
    </div>
  );
};

export default LifeBouy;
