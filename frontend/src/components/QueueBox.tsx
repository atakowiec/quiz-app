import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Clock, Loader2 } from "lucide-react";
import { clearQueue, useQueue } from "../store/queueSlice.ts";
import styles from "../styles/QueueBox.module.scss";
import { useSocket } from "../socket/useSocket.ts";
import { userActions, useUser } from "../store/userSlice.ts";
import getApi from "../api/axios.ts";

const QueueBox = () => {
  const dispatch = useDispatch();
  const { inQueue, fromDate } = useQueue();
  const [waitTime, setWaitTime] = useState("");
  const socket = useSocket();
  const user = useUser();

  useEffect(() => {
    if (!inQueue || !fromDate) return;

    const updateWaitTime = () => {
      const now = new Date();
      const fromDateParsed = new Date(fromDate); // Safely parse `fromDate`

      if (isNaN(fromDateParsed.getTime())) {
        setWaitTime("Invalid date");
        return;
      }

      const diff = now.getTime() - fromDateParsed.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setWaitTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateWaitTime();
    const interval = setInterval(updateWaitTime, 1000);

    return () => clearInterval(interval);
  }, [inQueue, fromDate]);

  const handleLeaveQueue = () => {
    socket.emit("leave_queue", () => {
      dispatch(clearQueue());
      if (!user?.id) {
        getApi()
          .post("/auth/logout")
          .then(() => {
            dispatch(userActions.setUser(null));
          })
          .catch((error) => {
            console.error("Error during logout:", error);
          });
      }
    });
  };

  if (!inQueue) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.queueInfo}>
        <div>
          <Loader2 className={`${styles.spin} ${styles.icon}`} />
          <span>You are in queue</span>
        </div>
        <div>
          <Clock className={styles.icon} />
          <span>Wait time: {waitTime}</span>
        </div>
      </div>
      <div>
        <button onClick={handleLeaveQueue} className={styles.leaveQueueButton}>
          Leave Queue
        </button>
      </div>
    </div>
  );
};

export default QueueBox;
