import { Modal, ModalBody } from "react-bootstrap";
import { FaCheckSquare, FaSquare } from "react-icons/fa";
import styles from "../Settings.module.scss";
import MainTitle from "../../../../../components/main-components/MainTitle.tsx";
import { GameSettings } from "@shared/game";
import { FC } from "react";

interface Category {
  id: number;
  name: string;
  img: string;
}

interface CategoriesModalProps {
  show: boolean;
  handleClose: () => void;
  categories: Category[];
  selectedCategories: number[];
  handleCategoryClick: (index: number) => void;
  selectAllCategories: () => void;
  deselectAllCategories: () => void;
  isOwner: boolean; // Indicates if the user is the owner
  gameSettings?: GameSettings;
}

const CategoriesModal: FC<CategoriesModalProps> = ({
  show,
  handleClose,
  categories,
  selectedCategories,
  handleCategoryClick,
  selectAllCategories,
  deselectAllCategories,
  isOwner,
  gameSettings, // Destructure gameSettings for non-owner
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className={styles.customModal}
    >
      <ModalBody className={styles.settModal}>
        <MainTitle>Wybór kategorii</MainTitle>
        <div className={styles.categoryModalBox}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${styles.categoriesChoice} ${
                isOwner
                  ? selectedCategories.includes(category.id)
                    ? styles.active
                    : ""
                  : gameSettings?.category_whitelist?.includes(category.id)
                    ? styles.active
                    : ""
              }`}
              onClick={
                isOwner ? () => handleCategoryClick(category.id) : undefined
              } // Disable click if not owner
            >
              <img
                src={`${category.img}`}
                alt={category.name}
                className={styles.categoryImage}
              />
              <div className={styles.categoryName}>{category.name}</div>
            </div>
          ))}
        </div>
        <div className={styles.settButtons}>
          {isOwner ? (
            <>
              <button className={styles.saveBut} onClick={handleClose}>
                Zapisz
              </button>
              <div className={styles.markButtons}>
                <button
                  className={styles.markBut}
                  onClick={selectAllCategories}
                >
                  <FaCheckSquare />
                </button>
                <button
                  className={styles.markBut}
                  onClick={deselectAllCategories}
                >
                  <FaSquare />
                </button>
              </div>
            </>
          ) : (
            <button className={styles.saveBut} onClick={handleClose}>
              Zamknij
            </button>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CategoriesModal;
