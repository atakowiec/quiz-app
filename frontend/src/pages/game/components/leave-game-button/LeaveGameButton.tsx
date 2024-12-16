import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RxExit } from "react-icons/rx";
import { gameActions } from "../../../../store/gameSlice";
import { useSocket } from "../../../../socket/useSocket";
import styles from "./LeaveGame.module.scss";
import { useState } from "react";
import ConfirmationModal from "../../../../components/main-components/ConfirmationModal.tsx";

const LeaveGameButton = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const leaveGame = () => {
    socket.emit("leave_not_ended_game");
    dispatch(gameActions.setGame(null));
    navigate("/");
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={styles.leaveGameButton}
      >
        Opuść grę
        <RxExit className={styles.exitIcon} />
      </button>
      <ConfirmationModal
        show={showModal}
        setShow={setShowModal}
        onConfirm={leaveGame}
        title={"Opuść grę"}
      >
        Czy na pewno chcesz opuścić grę?
      </ConfirmationModal>
    </>
  );
};

export default LeaveGameButton;
