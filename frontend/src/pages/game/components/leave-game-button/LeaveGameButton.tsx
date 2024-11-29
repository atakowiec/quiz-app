import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RxExit } from "react-icons/rx";
import { gameActions } from "../../../../store/gameSlice";
import { useSocket } from "../../../../socket/useSocket";
import styles from "./LeaveGame.module.scss";

const LeaveGameButton = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const leaveGame = () => {
    socket.emit("leave_not_ended_game");
    dispatch(gameActions.setGame(null));
    navigate("/");
  };

  return (
    <button
      onClick={leaveGame}
      className={styles.leaveGameButton} //do zmiany
    >
      Opuść grę
      <RxExit className={styles.exitIcon} />
    </button>
  );
};

export default LeaveGameButton;
