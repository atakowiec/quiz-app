import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import getApi from "../../../api/axios";
import styles from "./ChangePassword.module.scss";
import { toast } from "react-toastify";
import { FC } from "react";

interface ChangePasswordModalProps {
  show: boolean;
  handleClose: () => void;
}

const ChangePasswordModal: FC<ChangePasswordModalProps> = ({
  show,
  handleClose,
}) => {
  const validationSchema = yup.object({
    currentPassword: yup.string().required("Proszę wprowadzić obecne hasło"),
    newPassword: yup
      .string()
      .min(6, "Hasło musi mieć co najmniej 6 znaków")
      .required("Proszę wprowadzić nowe hasło")
      .notOneOf(
        [yup.ref("currentPassword")],
        "Nowe hasło musi być inne niż obecne"
      ),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Hasła muszą się zgadzać")
      .required("Proszę potwierdzić nowe hasło"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await getApi().patch("/users/update-profile", {
          currentPassword: values.currentPassword,
          password: values.newPassword,
        });
        toast.success("Hasło zostało zmienione");
        handleClose();
      } catch (error: any) {
        if (error.response) {
          const errorMessage = error.response.data.message;
          if (errorMessage === "Obecne hasło jest niepoprawne") {
            setErrors({ currentPassword: errorMessage });
          } else if (errorMessage === "Proszę podać obecne hasło") {
            setErrors({ currentPassword: errorMessage });
          } else {
            toast.error(errorMessage || "Wystąpił błąd podczas zmiany hasła");
          }
        } else {
          toast.error("Wystąpił błąd podczas zmiany hasła");
        }
      }
    },
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Zmień hasło</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Obecne hasło</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentPassword}
              className={
                formik.touched.currentPassword && formik.errors.currentPassword
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.currentPassword &&
              formik.errors.currentPassword && (
                <div className={styles.error}>
                  {formik.errors.currentPassword}
                </div>
              )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">Nowe hasło</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className={
                formik.touched.newPassword && formik.errors.newPassword
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className={styles.error}>{formik.errors.newPassword}</div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmNewPassword">Potwierdź nowe hasło</label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmNewPassword}
              className={
                formik.touched.confirmNewPassword &&
                formik.errors.confirmNewPassword
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.confirmNewPassword &&
              formik.errors.confirmNewPassword && (
                <div className={styles.error}>
                  {formik.errors.confirmNewPassword}
                </div>
              )}
          </div>
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
            >
              Anuluj
            </button>
            <button type="submit" className={styles.confirmButton}>
              Zmień hasło
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
