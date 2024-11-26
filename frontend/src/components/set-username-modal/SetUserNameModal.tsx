import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./setUserNameModal.module.scss";
import getApi from "../../api/axios.ts";
import { useDispatch } from "react-redux";
import { useSocket } from "../../socket/useSocket.ts";
import { userActions } from "../../store/userSlice.ts";
import MainTitle from "../MainTitle.tsx";

interface SetUserNameModalProps {
  confirmBtnText: string;
  onClose: () => void;
  onConfirm: () => void;
  show: boolean;
}
export default function SetUserNameModal(props: SetUserNameModalProps) {
  const userNameRef = useRef<HTMLInputElement>(null);
  const [usernameError, setUsernameError] = useState("");
  const dispatch = useDispatch();
  const socket = useSocket();

  function saveUserName() {
    const username = userNameRef.current?.value;
    dispatch(userActions.setUser(null));
    socket.disconnect();

    getApi()
      .post("/auth/username", { username: username })
      .then((response) => {
        setUsernameError("");

        if (response.status !== 200) {
          return;
        }

        dispatch(userActions.setUser(response.data));

        socket.connect();
        props.onConfirm();
      })
      .catch((err) => {
        console.error(err);
        setUsernameError(err.response.data.message);
      });
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      centered
      className={styles.modalCenter}
    >
      <Modal.Body>
        <MainTitle>Ustaw nick w grze</MainTitle>
        <div className={styles.center}>
          <input
            type={"text"}
            placeholder={"Twoja nazwa"}
            className={styles.input}
            ref={userNameRef}
          />
          {usernameError && <div className={styles.error}>{usernameError}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.modalButtons}>
        <button
          className={styles.confirmButton}
          onClick={() => {
            if (userNameRef.current?.value) {
              saveUserName();
            } else {
              setUsernameError("Nick jest wymagany");
            }
          }}
        >
          {props.confirmBtnText}
        </button>
        <button onClick={props.onClose} className={styles.cancelButton}>
          Anuluj
        </button>
      </Modal.Footer>
    </Modal>
  );
}
