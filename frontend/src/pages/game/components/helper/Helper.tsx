import React from "react";
import { IconType } from "react-icons";
import styles from "./Helper.module.scss";

interface HelperProps {
  icon: IconType;
  executeAction?: () => void;
}

const Helper: React.FC<HelperProps> = ({ icon: Icon, executeAction }) => {
  return (
    <div className={styles.lifeBouyContainer} onClick={executeAction}>
      <Icon className={styles.lifeBouyIcon} />
    </div>
  );
};

export default Helper;
