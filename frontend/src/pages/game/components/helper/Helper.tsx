import { IconType } from "react-icons";
import styles from "./Helper.module.scss";
import { FC } from "react";
import { HelperType } from "@shared/game";
import { useGame } from "../../../../store/gameSlice.ts";
import { useSocket } from "../../../../socket/useSocket.ts";

interface HelperProps {
  helper: HelperType;
  icon: IconType;
  description: string;
}

const Helper: FC<HelperProps> = ({
                                   helper,
                                   icon: Icon,
                                   description,
                                 }) => {
  const game = useGame()!;
  const socket = useSocket();

  const blackListedHelpers = game.settings.blackListedHelpers || [];
  const availableHelpers = game.player.availableHelpers.filter(
    (helper: HelperType) => !blackListedHelpers.includes(helper));

  function executeHelper() {
    if (game?.status !== "question_phase") return;
    if (!availableHelpers.includes(helper)) return;

    socket.emit("use_helper", helper);
  }

  function getHelperStyle() {
    if (!availableHelpers.includes(helper)) {
      return styles.notAvailable;
    }

    switch (helper) {
      case "cheat_from_others":
        return game.player.showOtherPlayersAnswers ? styles.inUse : "";
      case "extend_time":
        return game.player.timeToAnswer > game.settings.time_for_answer ? styles.inUse : "";
      case "fifty_fifty":
        return game.player.hiddenAnswers?.length ? styles.inUse : "";
      default:
        return "";
    }
  }

  return (
    <div className={`${styles.lifeBouyContainer} ${getHelperStyle()}`} onClick={executeHelper}>
      <Icon className={styles.lifeBouyIcon}/>
      <span className={styles.tooltip}>{description}</span>
    </div>
  );
};

export default Helper;
