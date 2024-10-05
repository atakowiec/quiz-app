import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import MainTitle from "../../components/MainTitle";
import { useGlobalData } from "../../store/globalDataSlice";
import styles from "./CategoriesModal.module.scss";

interface StatsModalProps {
  show: boolean;
  handleClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ show, handleClose }) => {
  const { categories = [] } = useGlobalData();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonType: string) => {
    setActiveButton(buttonType);
  };

  //TODO: poprawić by obrazki sie pporawnie wyświetlały, zrobić by sie statystyki wyswietlały i sortowały
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className={styles.customModal}
    >
      <ModalBody className={styles.settModal}>
        <MainTitle>Statystyki kategorii</MainTitle>
        <div className={styles.sortButtons}>
          <button
            className={`${styles.sortButton} ${activeButton === "points" ? styles.activeButton : ""}`}
            onClick={() => handleButtonClick("points")}
          >
            Względem średniej punktów
          </button>
          <button
            className={`${styles.sortButton} ${activeButton === "games" ? styles.activeButton : ""}`}
            onClick={() => handleButtonClick("games")}
          >
            Względem liczby gier
          </button>
        </div>
        <div className={styles.statsModalBox}>
          {categories.map((stat) => (
            <div key={stat.id} className={styles.statItem}>
              <div className={styles.imgName}>
                <img
                  className={styles.categoryImage}
                  src={stat.img}
                  alt={stat.name}
                />
                <div className={styles.categoryName}>{stat.name}</div>
              </div>
              <div className={styles.categoryCount}>{stat.id}</div>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default StatsModal;
