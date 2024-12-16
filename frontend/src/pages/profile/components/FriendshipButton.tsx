import { UserDetails } from "@shared/user";
import { useState } from "react";
import styles from "../Profile.module.scss";
import { BsPersonFillAdd, BsPersonFillCheck, BsPersonFillDown, BsPersonFillUp } from "react-icons/bs";
import ConfirmationModal from "../../../components/main-components/ConfirmationModal.tsx";
import { ClientToServerEventsKeys } from "@shared/socket";
import { useSocket } from "../../../socket/useSocket.ts";
import { getFriendshipStatus } from "../../../utils/utils.ts";
import { useUser } from "../../../store/userSlice.ts";

export type FriendshipButtonProps = {
  user: UserDetails;
}


export function FriendshipButton({ user }: FriendshipButtonProps) {
  const [unfriendConfirmation, setUnfriendConfirmation] = useState(false);
  const socket = useSocket()
  const loggedUser = useUser();
  const friendshipStatus = getFriendshipStatus(loggedUser, user.id);

  function handleFriendship() {
    setUnfriendConfirmation(false);

    const statusToEvent: { [_: string]: ClientToServerEventsKeys } = {
      friend: "remove_friend",
      none: "invite_friend",
      pending: "invite_friend",
      requested: "cancel_friend_request",
    }

    const event = statusToEvent[friendshipStatus];

    if (event == "remove_friend" && !unfriendConfirmation) {
      setUnfriendConfirmation(true);
      return;
    }

    socket.emit(event, user.id);
  }

  return (
    <>
      <button className={styles.friendBut} onClick={handleFriendship}>
        {friendshipStatus == "friend" &&
            <><BsPersonFillCheck className={styles.remove}/> Znajomi</>}
        {friendshipStatus == "none" &&
            <><BsPersonFillAdd className={styles.remove}/> Wyślij zaproszenie</>}
        {friendshipStatus == "pending" &&
            <><BsPersonFillDown className={styles.remove}/> Przyjmij zaproszenie</>}
        {friendshipStatus == "requested" &&
            <><BsPersonFillUp className={styles.remove}/> Anuluj zaproszenie</>}
      </button>
      <ConfirmationModal show={unfriendConfirmation}
                         setShow={setUnfriendConfirmation}
                         onConfirm={handleFriendship}
                         title={"Usuwanie znajomego"}>
        Czy na pewno chcesz usunąć tego znajomego?
      </ConfirmationModal>
    </>
  )
}