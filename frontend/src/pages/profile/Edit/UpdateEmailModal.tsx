import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Update.module.scss";
import getApi from "../../../api/axios";
import { userActions } from "../../../store/userSlice";
import { State } from "../../../store";

interface UpdateEmailModalProps {
  show: boolean;
  handleClose: () => void;
  userId?: number;
}

const UpdateEmailModal: React.FC<UpdateEmailModalProps> = ({
  show,
  handleClose,
  userId,
}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentEmail =
    useSelector<State, string | undefined>((state) => state.user.email) ?? "";

  useEffect(() => {
    if (show) {
      setEmail("");
      setError(null);
    }
  }, [show]);

  const handleEmailChange = async () => {
    if (!email) {
      setError("Proszę wprowadzić e-mail");
      return;
    }

    if (email === currentEmail) {
      setError("Nowy e-mail musi być inny niż obecny");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await getApi().patch("/users/update-profile", { email });
      dispatch(userActions.updateEmail(email));
      toast.success("E-mail został zmieniony");
      handleClose();
    } catch (err) {
      if (err instanceof Error) setError("Błąd przy aktualizacji e-maila");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Zmień e-mail</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <div className={styles.customForm}>
          <label htmlFor="email" className={styles.formLabel}>
            Nowy e-mail
          </label>
          <input
            id="email"
            type="email"
            className={`${styles.formControl} ${error ? styles.errorInput : ""}`}
            placeholder="Wprowadź nowy e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={handleClose}>
            Anuluj
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleEmailChange}
            disabled={loading || !email}
          >
            Zapisz
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateEmailModal;
