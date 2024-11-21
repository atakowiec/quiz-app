import React from "react";
import { Modal, Button, ModalBody } from "react-bootstrap";
import MainTitle from "../../../components/MainTitle";
import { useSelector } from "react-redux";
import { State } from "../../../store";
import { UserState } from "../../../store/userSlice";
import { useSocket } from "../../../socket/useSocket";
import styles from "./InviteModal.module.scss";
import FriendCard from "../../profile/components/FriendCard";

interface InviteModalProps {
  show: boolean;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ show, onClose }) => {
  const user: UserState = useSelector((state: State) => state.user);
  const socket = useSocket();

  const sortedFriends = (user.friends || [])
    .slice()
    .sort((a, b) => (a.status === "online" ? -1 : 1));

  return (
    <Modal show={show} onHide={onClose} centered>
      <ModalBody>
        <MainTitle>Zaproś do gry</MainTitle>
        {sortedFriends.length > 0 ? (
          <div className={styles.friendsBox}>
            {sortedFriends.map((friend, index) => (
              <FriendCard key={index} friend={friend} />
            ))}
          </div>
        ) : (
          <p>Brak znajomych</p>
        )}
      </ModalBody>
    </Modal>
  );
};

export default InviteModal;
