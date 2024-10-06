import styles from "../styles/Header.module.scss";
import { FaUser } from "react-icons/fa6";
import { CgClose } from "react-icons/cg";

export default function Notifications() {

  return (
    <div className={styles.notificationsBox}>
      <Notification/>
      <Notification/>
    </div>
  )
}

function Notification() {
  return (
    <div className={styles.notification}>
      <div className={styles.notificationIconBox}>
        {
          // random for presentation purposes - both are supported
          Math.random() > 0.5 ?
            <img src={"https://placehold.co/50"} alt={"awatar gracza atakowiec"}/>
            :
            <div style={{ backgroundColor: "#8c8ee3" }}>
              A
            </div>
        }
      </div>
      <div className={styles.notificationContentBox}>
        <div className={styles.notificationContent}>
          Otrzymałeś zaproszenie do znajomych od gracza atakowiec
        </div>
        <div className={styles.notificationTime}>
          5 minut temu
        </div>
        <div className={styles.notificationButtons}>
          <button className={styles.primary}>
            Przyjmij
          </button>
          <button className={styles.secondary}>
            Odrzuć
          </button>
          <button className={styles.secondary}>
            <FaUser />
          </button>
        </div>
      </div>
      <div className={styles.closeButtonBox}>
        <div>
          <CgClose/>
        </div>
      </div>
    </div>
  )
}