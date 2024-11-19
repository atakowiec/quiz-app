import styles from "./Category.module.scss";
import { useGlobalData } from "../../../store/globalDataSlice.ts";
import { useSocket } from "../../../socket/useSocket.ts";
import { useGame } from "../../../store/gameSlice.ts";
import ProfileIcon from "../../../components/ProfileIcon.tsx";

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
  const playersVoted =
    game?.players?.filter((player) => player.chosenCategory === categoryId) ||
    [];

  const maxDisplayedPlayers = 5;
  const extraPlayers =
    playersVoted.length > maxDisplayedPlayers
      ? playersVoted.length - maxDisplayedPlayers
      : 0;

  return (
    <div>
      {" "}
      <div
        className={`${styles.choice} ${voted ? styles.selected : ""}`}
        onClick={voteForCategory}
      >
        <img src={category.img} alt={category.name} />
        {category.name}
        {playersVoted.length > 0 && (
          <div className={styles.voteIcons}>
            {playersVoted.slice(0, maxDisplayedPlayers).map((player) => (
              <ProfileIcon className={styles.voteIcon}
                           username={player.username}
                           iconColor={player.iconColor}
                           key={player.username} />
            ))}
            {extraPlayers > 0 && (
              <span className={styles.extraVotes}>+{extraPlayers}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
