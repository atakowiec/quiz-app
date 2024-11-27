import { Link } from "react-router-dom";
import styles from "../categories.module.scss";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../../../components/ConfirmationModal.tsx";
import { useState } from "react";
import EditCategoryModal from "./EditCategoryModal.tsx";

interface CategoryElementProps {
  id: number;
  name: string;
  description?: string;
  img?: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function CategoryElement(props: CategoryElementProps) {
  const handleEdit = () => {
    if (props.onEdit) {
      props.onEdit(props.id);
    }
  };

  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete(props.id);
    }
  };
  function handleDeleteClick() {
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
        <FaTrash
          className={styles.icon}
          onClick={() => handleDeleteClick()}
          title="Delete"
        />
      </div>
      <Link to={`/admin/categories/${props.name}`}>
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
        onConfirm={handleDelete}
        confirmText={"Tak, usuń kategorie"}
        title={`Usuwanie kategorii ${props.name}`}
      >
        Czy na pewno chcesz usunąć kategorię {props.name}?
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
