import React from "react";
import { IconType } from "react-icons";
import styles from "./Helper.module.scss";

interface HelperProps {
  icon: IconType;
  executeAction?: () => void;
  description: string;
}

const Helper: React.FC<HelperProps> = ({
  icon: Icon,
  executeAction,
  description,
}) => {
  return (
    <div className={styles.lifeBouyContainer} onClick={executeAction}>
      <Icon className={styles.lifeBouyIcon} />
      <span className={styles.tooltip}>{description}</span>
    </div>
  );
};

export default Helper;
