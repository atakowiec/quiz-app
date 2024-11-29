import { Link } from "react-router-dom";
import styles from "../styles/Categories.module.scss";
import { FaEdit } from "react-icons/fa";
import ConfirmationModal from "../../../../components/ConfirmationModal.tsx";
import { useState } from "react";
import EditCategoryModal from "./EditCategoryModal.tsx";
import { SlPower } from "react-icons/sl";

interface CategoryElementProps {
  id: number;
  name: string;
  description?: string;
  img?: string;
  isActive?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function CategoryElement(props: CategoryElementProps) {
  const handleEdit = () => {
    if (props.onEdit) {
      props.onEdit(props.id);
    }
  };

  const handleStatusChange = () => {
    if (props.onDelete) {
      props.onDelete(props.id);
    }
  };

  function changeStatus() {
    setShowDeleteConfirmModal(true);
  }

  function handleEditClick() {
    setShowEditCategoryModal(true);
  }

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);

  return (
    <div className={styles.catBox}>
      <div className={styles.iconWrapper}>
        <FaEdit
          className={styles.icon}
          title="Edit"
          onClick={() => handleEditClick()}
        />

        <SlPower
          className={styles.icon}
          title="Change status"
          style={{
            color: props.isActive ? "lightgreen" : "red",
          }}
          onClick={() => changeStatus()}
        />
      </div>
      <Link to={`/admin/categories/${encodeURIComponent(props.name)}`}>
        <img
          src={`${props.img}`}
          alt={props.name}
          className={styles.categoryImage}
        />
        <div className={styles.categoryDetails}>
          <h3 className={styles.categoryName}>{props.name}</h3>
          <p className={styles.categoryDesc}>{props.description}</p>
        </div>
      </Link>
      <ConfirmationModal
        show={showDeleteConfirmModal}
        setShow={setShowDeleteConfirmModal}
        onConfirm={handleStatusChange}
        confirmText={"Tak, zmień status"}
        title={`Zmiana statusu kategorii ${props.name}`}
      >
        Czy na pewno chcesz zmienić status kategori {props.name} na{" "}
        {props.isActive ? "nieaktywną" : "aktywną"}?
      </ConfirmationModal>
      <EditCategoryModal
        show={showEditCategoryModal}
        setShow={setShowEditCategoryModal}
        categoryId={props.id}
        initialData={{
          categoryName: props.name,
          description: props.description || "",
          imgPreview: props.img || null,
        }}
        onConfirm={handleEdit}
        onError={(error) => console.error("Błąd edycji:", error)}
      />
    </div>
  );
}
