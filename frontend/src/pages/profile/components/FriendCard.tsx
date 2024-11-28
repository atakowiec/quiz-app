import { Friend } from "@shared/friends";
import styles from "../Profile.module.scss";
import { FaCircle } from "react-icons/fa";
import { GiGamepad } from "react-icons/gi";
import { IoMdPerson } from "react-icons/io";
import useProfileModal from "../../../hooks/profile-modal/useProfileModal.ts";
import { useSocket } from "../../../socket/useSocket.ts";
import { useGame } from "../../../store/gameSlice.ts";
import { translateUserStatus } from "../../../utils/utils.ts";
import ProfileIcon from "../../../components/ProfileIcon.tsx";

export default function FriendCard({ friend }: { friend: Friend }) {
  const { showModal } = useProfileModal();
  const socket = useSocket();
  const game = useGame();

  const canInviteToGame =
    friend &&
    friend.status === "online" &&
    game?.gameType == "multiplayer" &&
    game?.status === "waiting_for_players";

  function sendGameInvite() {
    if (!canInviteToGame) return;

    socket.emit("send_game_invite", friend.id);
  }

  return (
    <div className={styles.friend}>
      <div className={styles.friendIconNick}>
        <ProfileIcon
          className={styles.friendIcon}
          username={friend.username}
          iconColor={friend.iconColor}
        />
        <div className={styles.nickStatus}>
          <div className={styles.friendNick}>{friend.username}</div>
          <div className={`${styles.status} ${styles[friend.status]}`}>
            <FaCircle className={styles.circle} />
            {translateUserStatus(friend.status)}
          </div>
        </div>
      </div>
      <div className={styles.rightSide}>
        {canInviteToGame && (
          <button className={styles.invite} onClick={sendGameInvite}>
            <GiGamepad className={styles.gamePad} /> Zaproś do gry
          </button>
        )}
        <button
          className={styles.friendModal}
          onClick={() => showModal(friend.id)}
        >
          <IoMdPerson />
        </button>
      </div>
    </div>
  );
}
