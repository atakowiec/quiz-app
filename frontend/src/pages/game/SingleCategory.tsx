import styles from "../../styles/Category.module.scss";
import { useGlobalData } from "../../store/globalDataSlice.ts";
import { useSocket } from "../../socket/useSocket.ts";
import { useGame } from "../../store/gameSlice.ts";

export default function SingleCategory({ categoryId }: { categoryId: number }) {
  const socket = useSocket();
  const game = useGame();
  const category = useGlobalData().categories.find(
    (category) => category.id === categoryId
  );
  if (!category) {
    return null;
  }

  function voteForCategory() {
    socket.emit("select_category", categoryId);
  }

  const voted = game?.player.chosenCategory === categoryId;
  const playersVoted = game?.players?.filter(
    (player) => player.chosenCategory === categoryId
  );

  return (
    <div
      className={`${styles.choice} ${voted ? styles.selected : ""}`}
      onClick={voteForCategory}
    >
      <img src={"https://via.placeholder.com/250"} alt={category.name} />
      {category.name}
      {/* todo display players that voted on current category */}
      {playersVoted && (
        <ul>
          {playersVoted.map((player) => (
            <li key={player.username}>{player.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
