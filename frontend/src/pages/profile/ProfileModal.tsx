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
import ProfileIcon from "../../components/ProfileIcon.tsx";
import { UserDetails } from "@shared/user";
import { FC } from "react";

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

const ProfileModal: FC<ProfileModalProps> = ({
                                                     show,
                                                     handleClose,
                                                     userId,
                                                   }) => {
  const socket = useSocket();
  const { friends, id: loggedUserId } = useUser();
  const game = useGame();
  const friend = friends?.find((f) => f.id === userId);

  const { data: user } = useApi<UserDetails>(`/users/get-by-id/${userId}`, "get")
  const {loaded: statsLoaded, data: statsData} = useApi<ProfileStats>(`/history/stats/${userId}`, "get");

  const rankingData = statsData?.rankingPlaces || [];
  const gamesPlayed = Number(statsData?.gamesPlayed) || 0;
  const averageScore = Number(statsData?.averageScore) || 0;

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
            <ProfileIcon username={user?.username} iconColor={user?.iconColor} className={styles.profileIcon}/>
            <div className={styles.nameEmail}>
              <div className={styles.profileName}>
                {user?.username ?? "-"}
              </div>
              {
                friend &&
                  <div className={`${styles.status} ${styles[friend?.status ?? "offline"]}`}>
                      <FaCircle className={styles.circle}/>
                    {translateUserStatus(friend?.status ?? "offline")}
                  </div>
              }
            </div>
          </div>
          <div className={styles.rightSide}>
            {canInviteToGame && (
              <button className={styles.inviteF} onClick={inviteToGame}>
                <GiGamepad className={styles.gamePad}/>
                Zaproś do gry
              </button>
            )}
            {user && userId != loggedUserId && <FriendshipButton user={user}/>}
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
