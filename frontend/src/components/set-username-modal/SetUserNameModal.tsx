import React, { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styles from "./setUserNameModal.module.scss";
import getApi from "../../api/axios.ts";
import { useDispatch } from "react-redux";
import { useSocket } from "../../socket/useSocket.ts";
import { userActions } from "../../store/userSlice.ts";

interface SetUserNameModalProps {
  confirmBtnText: string;
  onClose: () => void;
  onConfirm: () => void;
  show: boolean;
}
export default function SetUserNameModal(props: SetUserNameModalProps) {
  const userNameRef = useRef<HTMLInputElement>(null);
  const [nicknameError, setNicknameError] = useState("");
  const dispatch = useDispatch();
  const socket = useSocket();

  function saveUserName() {
    const nickName = userNameRef.current?.value;
    getApi()
      .post("/auth/nickname", { nickname: nickName })
      .then((response) => {
        setNicknameError("");

        if (response.status !== 200) {
          return;
        }

        dispatch(userActions.setUser(response.data));

        socket.connect();
        props.onConfirm();
      })
      .catch((err) => {
        console.error(err);
        setNicknameError(err.response.data.message);
      });
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      centered
      className={styles.modalCenter}
    >
      <Modal.Header closeButton>
        <Modal.Title className={styles.modalTitle}>
          Ustaw nick w grze
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type={"text"}
          placeholder={"nickname"}
          className={styles.input}
          ref={userNameRef}
        />
        {nicknameError && <div className={styles.error}>{nicknameError}</div>}
      </Modal.Body>
      <Modal.Footer className={styles.modalButtons}>
        <Button
          variant="primary"
          onClick={() => {
            if (userNameRef.current?.value) {
              saveUserName();
            } else {
              setNicknameError("Nick jest wymagany");
            }
          }}
        >
          {props.confirmBtnText}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          Anuluj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
