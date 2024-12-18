import styles from "../styles/Header.module.scss";
import { FaUser } from "react-icons/fa6";
import { CgClose } from "react-icons/cg";
import { useNotifications } from "../store/notificationsSlice.ts";
import { GameInviteNotification, INotification } from "@shared/notifications";
import useProfileModal from "../hooks/profile-modal/useProfileModal.ts";
import { useSocket } from "../socket/useSocket.ts";
import { useNavigate } from "react-router-dom";

type NotificationsProps = {
  show: boolean;
  setShow: (show: boolean) => void;
}

function getNotificationMessage(notification: INotification) {
  switch (notification.type) {
    case "game_invite":
      return `${notification.inviter.username} zaprosił Cię do gry`;
    case "friend_request":
      return `${notification.inviter.username} zaprosił Cię do znajomych`;
    default:
      return "-";
  }
}

function getTimePretty(notification: INotification) {
  const diff = new Date().getTime() - new Date(notification.createdAt).getTime();

  if (diff < 1000 * 60) {
    return "teraz";
  } else if (diff < 1000 * 60 * 60) {
    return `${Math.floor(diff / 1000 / 60)} minut temu`;
  } else if (diff < 1000 * 60 * 60 * 24) {
    return `${Math.floor(diff / 1000 / 60 / 60)} godzin temu`;
  } else {
    return `${Math.floor(diff / 1000 / 60 / 60 / 24)} dni temu`;
  }
}

export default function Notifications({ setShow, show }: NotificationsProps) {
  const notifications = useNotifications()

  return (
    <>
      {show && <div className={styles.notificationOverlay} onClick={() => setShow(false)}/>}
      <div className={`${styles.notificationsBox} ${show ? "" : styles.hide}`}>
        {
          notifications.map((notification) => (
            <Notification key={notification.id} notification={notification}/>
          ))
        }
        {
          notifications.length === 0 &&
          <div className={styles.noNotifications}>
            Brak powiadomień
          </div>
        }
      </div>
    </>
  )
}

function Notification({ notification }: { notification: INotification }) {
  const { showModal } = useProfileModal()
  const socket = useSocket()
  const navigate = useNavigate()

  function acceptNotification() {
    if (notification.type === "game_invite") {
      socket.emit("join_game", (notification as GameInviteNotification).gameId, () =>
        navigate("/waiting-room")
      )
    } else if (notification.type === "friend_request") {
      socket.emit("invite_friend", notification.inviter.id);
    }
  }

  function declineNotification() {
    socket.emit("decline_notification", notification)
  }

  return (
    <div className={styles.notification}>
      <div className={styles.notificationIconBox}>
        <div style={{ backgroundColor: "#8c8ee3" }}>
          {notification.inviter.username[0].toUpperCase()}
        </div>
      </div>
      <div className={styles.notificationContentBox}>
        <div className={styles.notificationContent}>
          {getNotificationMessage(notification)}
        </div>
        <div className={styles.notificationTime}>
          {getTimePretty(notification)}
        </div>
        <div className={styles.notificationButtons}>
          <button className={styles.primary} onClick={acceptNotification}>
            Przyjmij
          </button>
          <button className={styles.secondary} onClick={declineNotification}>
            Odrzuć
          </button>
          <button className={styles.secondary} onClick={() => showModal(notification.inviter.id)}>
            <FaUser/>
          </button>
        </div>
      </div>
      <div className={styles.closeButtonBox}>
        <div onClick={declineNotification}>
          <CgClose/>
        </div>
      </div>
    </div>
  )
}