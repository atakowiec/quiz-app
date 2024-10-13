import React from "react";
import { Modal } from "react-bootstrap";
import styles from "./Profile.module.scss";
import { FaCircle } from "react-icons/fa";
import MainTitle from "../../components/MainTitle.tsx";
import RankingVisualization from "../game-stats/RankingVisualization.tsx";
import { GiGamepad } from "react-icons/gi";
import useApi from "../../api/useApi.ts";
import { UserDetails } from "@shared/user";
import { useSocket } from "../../socket/useSocket.ts";
import { useGame } from "../../store/gameSlice.ts";
import { toast } from "react-toastify";
import { useUser } from "../../store/userSlice.ts";
import { getFriend, translateUserStatus } from "../../utils/utils.ts";
import { FriendshipButton } from "./components/FriendshipButton.tsx";


interface ProfileModalProps {
  show: boolean;
  handleClose: () => void;
  userId: number;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ show, handleClose, userId }) => {
  const socket = useSocket();
  const { loaded, data: user } = useApi<UserDetails>(`/users/get-by-id/${userId}`, "get")
  const userLoaded = loaded && !!user;
  const game = useGame()
  const loggedUser = useUser()
  const isOwnUser = loggedUser?.id === userId;

  const friend = getFriend(loggedUser, userId);

  const canInviteToGame = !isOwnUser && userLoaded && friend && friend.status == "online" && game?.status == "waiting_for_players";

  function inviteToGame() {
    if (!user)
      return

    if (game?.status != "waiting_for_players") {
      toast.warning("Nie możesz tego teraz zrobić!")

      return
    }

    socket.emit("send_game_invite", user.id)
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <MainTitle>Profil</MainTitle>
          <div className={styles.profileBox}>
            <div className={styles.iconAndName}>
              <div className={styles.profileIcon}>
                {user?.username?.[0] ?? "-"}
              </div>
              <div className={styles.nameEmail}>
                <div className={styles.profileName}>{userLoaded ? user.username : "-"}</div>
                {
                  friend &&
                  <div className={`${styles.status} ${styles[friend.status ?? "offline"]}`}>
                    <FaCircle className={styles.circle}/>
                    {translateUserStatus(friend.status ?? "offline")}
                  </div>
                }
              </div>
            </div>
            <div className={styles.rightSide}>
              {
                canInviteToGame &&
                  <button className={styles.inviteF} onClick={inviteToGame}>
                      <GiGamepad className={styles.gamePad}/>
                      Zaproś do gry
                  </button>
              }
              {
                !isOwnUser && userLoaded && <FriendshipButton user={user} />
              }
            </div>
          </div>
          <div className={styles.friendRanking}>
            <RankingVisualization/>
            <div className={styles.friendStats}>
              <div>Zagranych Gier</div>
              <div>1500</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileModal;
