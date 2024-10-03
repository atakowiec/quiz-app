import React from "react";
import { Modal, ModalBody } from "react-bootstrap";
import { FaCheckSquare, FaSquare } from "react-icons/fa";
import styles from "./Settings.module.scss";
import MainTitle from "../../../components/MainTitle";

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
}

const CategoriesModal: React.FC<CategoriesModalProps> = ({
  show,
  handleClose,
  categories,
  selectedCategories,
  handleCategoryClick,
  selectAllCategories,
  deselectAllCategories,
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
                selectedCategories.includes(category.id) ? styles.active : ""
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <img
                src={`/assets/categories/${category.img || "default.jpg"}`}
                alt={category.name}
                className={styles.categoryImage}
              />
              <div className={styles.categoryName}>{category.name}</div>
            </div>
          ))}
        </div>
        <div className={styles.settButtons}>
          <button className={styles.saveBut} onClick={handleClose}>
            Zapisz
          </button>
          <div className={styles.markButtons}>
            <button className={styles.markBut} onClick={selectAllCategories}>
              <FaCheckSquare />
            </button>
            <button className={styles.markBut} onClick={deselectAllCategories}>
              <FaSquare />
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CategoriesModal;
