import React from "react";
import { Modal } from "react-bootstrap";
import styles from "./Profile.module.scss";
import { FaCircle } from "react-icons/fa";
import MainTitle from "../../components/MainTitle.tsx";
import RankingVisualization from "../game-stats/RankingVisualization.tsx";
import { GiGamepad } from "react-icons/gi";
import useApi from "../../api/useApi.ts";
import { FriendshipStatus, UserDetails } from "@shared/user";
import {
  BsPersonFillAdd,
  BsPersonFillCheck,
  BsPersonFillDown,
  BsPersonFillUp
} from "react-icons/bs";
import { useSocket } from "../../socket/useSocket.ts";
import { produce } from "immer";
import { ClientToServerEventsKeys } from "@shared/socket";


interface ProfileModalProps {
  show: boolean;
  handleClose: () => void;
  userId: number;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ show, handleClose, userId }) => {
  const socket = useSocket();
  const { loaded, data: user, setData: setUserData } = useApi<UserDetails>(`/users/${userId}`, "get")
  const userLoaded = loaded && !!user;

  function setFriendshipStatus(newStatus: FriendshipStatus) {
    if (!user)
      return;

    setUserData(produce(user, draft => {
      draft.friendship.status = newStatus;
    }))
  }

  function handleFriendship() {
    if (!user?.friendship) {
      return;
    }

    const statusToEvent: { [_: string]: ClientToServerEventsKeys } = {
      friend: "remove_friend",
      none: "invite_friend",
      pending: "invite_friend",
      requested: "cancel_friend_request",
    }

    socket.emit(statusToEvent[user.friendship.status], user.id, setFriendshipStatus);
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <MainTitle>Profil</MainTitle>
        <div className={styles.profileBox}>
          <div className={styles.iconAndName}>
            <div className={styles.profileIcon}>
              {userLoaded ? user.username?.[0] ?? "-" : "-"}
            </div>
            <div className={styles.nameEmail}>
              <div className={styles.profileName}>{userLoaded ? user.username : "-"}</div>
              <div className={styles.statusOnline}>
                <FaCircle className={styles.circle}/>
                online
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <button className={styles.inviteF}>
              <GiGamepad className={styles.gamePad}/> Zaproś do gry
            </button>
            {
              userLoaded && (
                <button className={styles.friendBut} onClick={handleFriendship}>
                  {user.friendship.status == "friend" && <><BsPersonFillCheck className={styles.remove}/></>}
                  {user.friendship.status == "none" && <><BsPersonFillAdd className={styles.remove}/></>}
                  {user.friendship.status == "pending" && <><BsPersonFillDown className={styles.remove}/></>}
                  {user.friendship.status == "requested" && <><BsPersonFillUp className={styles.remove}/></>}
                </button>
              )
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
  );
};

export default ProfileModal;
