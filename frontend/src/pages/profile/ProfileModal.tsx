import React from "react";
import { Modal } from "react-bootstrap";
import styles from "./Profile.module.scss";
import { FaCircle } from "react-icons/fa";
import MainTitle from "../../components/MainTitle.tsx";
import RankingVisualization from "../game-stats/RankingVisualization.tsx";
import { GiGamepad } from "react-icons/gi";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import useApi from "../../api/useApi.ts";
import { UserDetails } from "@shared/user";

interface ProfileModalProps {
  show: boolean;
  handleClose: () => void;
  userId: number;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  show,
  handleClose,
  userId
}) => {

  const {loaded, data: user} = useApi<UserDetails>(`/users/${userId}`, "get")
  const userLoaded = loaded && !!user;

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
                <FaCircle className={styles.circle} />
                online
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <button className={styles.inviteF}>
              <GiGamepad className={styles.gamePad} /> Zaproś do gry
            </button>
            <button className={styles.friendBut}>
              <MdPersonRemoveAlt1 className={styles.remove} />
            </button>
          </div>
        </div>
        <div className={styles.friendRanking}>
          <RankingVisualization />
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
