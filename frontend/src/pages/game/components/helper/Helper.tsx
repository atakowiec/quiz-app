import { IconType } from "react-icons";
import styles from "./Helper.module.scss";
import { FC } from "react";

interface HelperProps {
  icon: IconType;
  executeAction?: () => void;
  description: string;
}

const Helper: FC<HelperProps> = ({
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
