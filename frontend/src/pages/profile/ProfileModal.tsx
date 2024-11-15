import React from "react";
import { Modal } from "react-bootstrap";
import styles from "./Profile.module.scss";
import { FaCircle } from "react-icons/fa";
import MainTitle from "../../components/MainTitle";
import RankingVisualization from "../game-stats/RankingVisualization";
import { GiGamepad } from "react-icons/gi";
import useApi from "../../api/useApi";
import { useSocket } from "../../socket/useSocket";
import { useGame } from "../../store/gameSlice";
import { toast } from "react-toastify";
import { useUser } from "../../store/userSlice";
import { translateUserStatus } from "../../utils/utils";
import { FriendshipButton } from "./components/FriendshipButton";

interface ProfileModalProps {
  show: boolean;
  handleClose: () => void;
  userId: number;
}

interface RankingPlace {
  place: string;
  count: number;
  unit: string;
  percentage: number;
}

interface ProfileStats {
  gamesPlayed: number;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  totalScore: number;
  averageScore: number;
  maxScore: number;
  rankingPlaces: RankingPlace[];
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  show,
  handleClose,
  userId,
}) => {
  const socket = useSocket();
  const { friends } = useUser(); // Access friends from Redux
  const friend = friends?.find((f) => f.id === userId); // Find the correct friend

  // Use useApi to fetch stats for the friend
  const {
    loaded: statsLoaded,
    data: statsData,
    error: statsError,
  } = useApi<ProfileStats>(`/history/stats/${userId}`, "get");

  // Extract data from statsData
  const rankingData = statsData?.rankingPlaces || [];
  const gamesPlayed = Number(statsData?.gamesPlayed) || 0;
  const averageScore = Number(statsData?.averageScore) || 0;

  const game = useGame();
  const canInviteToGame =
    friend &&
    friend.status === "online" &&
    game?.status === "waiting_for_players";

  const inviteToGame = () => {
    if (!friend) return;

    if (game?.status !== "waiting_for_players") {
      toast.warning("Nie możesz tego teraz zrobić!");
      return;
    }

    socket.emit("send_game_invite", userId);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <MainTitle>Profil</MainTitle>
        <div className={styles.profileBox}>
          <div className={styles.iconAndName}>
            <div className={styles.profileIcon}>
              {friend?.username?.[0] ?? "-"}
            </div>
            <div className={styles.nameEmail}>
              <div className={styles.profileName}>
                {friend?.username ?? "-"}
              </div>
              <div
                className={`${styles.status} ${styles[friend?.status ?? "offline"]}`}
              >
                <FaCircle className={styles.circle} />
                {translateUserStatus(friend?.status ?? "offline")}
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            {canInviteToGame && (
              <button className={styles.inviteF} onClick={inviteToGame}>
                <GiGamepad className={styles.gamePad} />
                Zaproś do gry
              </button>
            )}
            {friend && <FriendshipButton user={friend} />}
          </div>
        </div>
        <div className={styles.friendRanking}>
          <RankingVisualization
            rankingData={rankingData}
            className={styles.friendsStats}
          />
          <div className={styles.friendStats}>
            <div>Liczba zagranych gier</div>
            <div>{statsLoaded ? gamesPlayed : "Ładowanie..."}</div>
          </div>
          <div className={styles.friendStats}>
            <div>Średnia liczba punktów</div>
            <div>{statsLoaded ? averageScore : "Ładowanie..."}</div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;
