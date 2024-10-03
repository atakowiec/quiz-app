import React from "react";
import { Modal, ModalBody } from "react-bootstrap";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineMoreTime, MdQueryStats } from "react-icons/md";
import styles from "./Settings.module.scss";
import MainTitle from "../../../components/MainTitle";

interface HelpersModalProps {
  show: boolean;
  handleClose: () => void;
  helperStates: boolean[];
  handleToggle: (index: number) => void;
}

const HelpersModal: React.FC<HelpersModalProps> = ({
  show,
  handleClose,
  helperStates,
  handleToggle,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      className={styles.customModal}
    >
      <ModalBody className={styles.settModal}>
        <MainTitle>Koła ratunkowe</MainTitle>
        <div className={styles.helpers}>
          {helperStates.map((isEnabled, index) => (
            <div key={index} className={styles.singleHelper}>
              {index === 0 && <FaRegEye className={styles.helperIcon} />}
              {index === 1 && (
                <MdOutlineMoreTime className={styles.helperIcon} />
              )}
              {index === 2 && <MdQueryStats className={styles.helperIcon} />}
              <div className={styles.helper}>
                <div className={styles.helperName}>
                  {index === 0 && "Zobacz odpowiedzi innych"}
                  {index === 1 && "Wydłuż czas na odpowiedź"}
                  {index === 2 && "50/50"}
                </div>
                <div className={styles.helperDesc}>
                  {index === 0 &&
                    "Użyte przed wybraniem odpowiedzi, pozwala graczowi na wgląd w odpowiedzi udzielone przez innych graczy."}
                  {index === 1 &&
                    "Użyte przed wybraniem odpowiedzi, pozwala graczowi na wydłużenie czasu na odpowiedź."}
                  {index === 2 &&
                    "Użyte przed wybraniem odpowiedzi, pozwala graczowi na wyeliminowanie dwóch błędnych odpowiedzi."}
                </div>
              </div>
              <div className={styles.toggleContainer}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleToggle(index)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.settButtons}>
          <button className={styles.saveBut} onClick={handleClose}>
            Zapisz
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default HelpersModal;
