import React from "react";
import { Modal } from "react-bootstrap";
import styles from "./Profile.module.scss";
import { FaCircle } from "react-icons/fa";
import MainTitle from "../../components/MainTitle.tsx"; // Zależnie od struktury projektu
import RankingVisualization from "../game-stats/RankingVisualization.tsx"; // Import rankingu
import { GiGamepad } from "react-icons/gi";
import { IoMdPerson } from "react-icons/io";
import { MdPersonRemoveAlt1 } from "react-icons/md";

interface ProfileModalProps {
  show: boolean;
  handleClose: () => void;
  user: any;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  show,
  handleClose,
  user,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <MainTitle>Profil</MainTitle>
        <div className={styles.profileBox}>
          <div className={styles.iconAndName}>
            <div className={styles.profileIcon}>{user.username[0]}</div>
            <div className={styles.nameEmail}>
              <div className={styles.profileName}>{user.username}</div>
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
