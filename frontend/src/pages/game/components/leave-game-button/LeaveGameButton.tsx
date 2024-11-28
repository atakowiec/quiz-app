import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RxExit } from "react-icons/rx";
import { gameActions } from "../../../../store/gameSlice";
import { useSocket } from "../../../../socket/useSocket";

const LeaveGameButton = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const leaveGame = () => {
    socket.emit("leave_game");
    dispatch(gameActions.setGame(null));
    navigate("/");
  };

  return (
    <button
      onClick={leaveGame}
      className="fixed bottom-4 left-4 bg-gray-500 text-white p-3 flex items-center justify-center" //do zmiany
    >
      <RxExit className="w-6 h-6" />
    </button>
  );
};

export default LeaveGameButton;
