import styles from "../pages/game/waiting-room/WaitingRoom.module.scss";
import { Modal } from "react-bootstrap";
import { ReactNode } from "react";

type ConfirmationModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmationModal(props: ConfirmationModalProps) {
  function confirm() {
    props.onConfirm();
    props.setShow(false);
  }

  function cancel() {
    props.onCancel?.();
    props.setShow(false);
  }

  return (
    <Modal
      show={props.show}
      onHide={() => props.setShow(false)}
      centered
      className={styles.modalCenter}
    >
      <Modal.Header closeButton>
        <Modal.Title className={styles.modalOwnerTitle}>
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.modalBody}>{props.children}</div>
      </Modal.Body>
      <Modal.Footer className={styles.modalButtons}>
        <button onClick={confirm} className={styles.modalConfirmBut}>
          {props.confirmText ?? "Potwierdź"}
        </button>
        <button onClick={cancel} className={styles.modalCancelBut}>
          {props.cancelText ?? "Anuluj"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
