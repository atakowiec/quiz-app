import { useState, ChangeEvent, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { CategoryService } from "../../../../api/categoryService";
import MainTitle from "../../../../components/main-components/MainTitle.tsx";
import CustomInput from "../../../../components/main-components/CustomInput.tsx";
import { useDispatch } from "react-redux";
import { globalDataActions } from "../../../../store/globalDataSlice";
import { toast } from "react-toastify";
import styles from "../styles/CreateCategoryModal.module.scss";

interface EditCategoryModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  categoryId: number;
  initialData: {
    categoryName: string;
    description: string;
    imgPreview: string | null;
  };
  onConfirm: () => void;
  onError: (error: Error) => void;
}

export default function EditCategoryModal(props: EditCategoryModalProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    categoryName: props.initialData.categoryName,
    description: props.initialData.description,
    img: null as File | null,
    imgPreview: props.initialData.imgPreview,
  });

  const [errors, setErrors] = useState<{ categoryName: string; img?: string }>({
    categoryName: "",
    img: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      categoryName: props.initialData.categoryName,
      description: props.initialData.description,
      img: null,
      imgPreview: props.initialData.imgPreview,
    });
  }, [props.initialData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "categoryName") {
      setErrors((prev) => ({
        ...prev,
        categoryName: "",
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|avif)$/)) {
        setErrors((prev) => ({
          ...prev,
          img: "Zdjęcie musi być w formacie jpeg, png lub avif",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          img: "Zdjęcie nie może być większe niż 5MB",
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          img: file,
          imgPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({
        ...prev,
        img: "",
      }));
    }
  };

  const handleClose = () => {
    props.setShow(false);
  };

  const refreshCategories = async () => {
    try {
      const categories = await CategoryService.getCategories();
      dispatch(globalDataActions.setData({ categories }));
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Nie udało się odświeżyć listy kategorii");
      }
    }
  };

  const handleSubmit = async () => {
    const updatedData: Partial<{
      categoryName: string;
      description: string;
      img: File;
    }> = {};

    if (formData.categoryName !== props.initialData.categoryName) {
      updatedData.categoryName = formData.categoryName;
    }

    if (formData.description !== props.initialData.description) {
      updatedData.description = formData.description;
    }

    if (formData.img) {
      updatedData.img = formData.img;
    }

    if (Object.keys(updatedData).length === 0) {
      handleClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await CategoryService.updateCategory(props.categoryId, updatedData);
      await refreshCategories();
      toast.success("Kategoria została zaktualizowana");
      props.onConfirm();
      handleClose();
    } catch (error) {
      console.error("Błąd podczas edycji kategorii:", error);
      if (error instanceof Error) {
        props.onError(error);
        toast.error(`Błąd podczas edycji kategorii: ${error.message}`);
      } else {
        props.onError(new Error("Nieznany błąd podczas edycji kategorii"));
        toast.error("Nieznany błąd podczas edycji kategorii");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      centered
      className={styles.modalCenter}
    >
      <Modal.Body>
        <MainTitle>Edytuj kategorię</MainTitle>
        {isSubmitting ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingContainer}>
              <p className={styles.loadingText}>Zapisywanie zmian...</p>
              <div className={styles.loading}></div>
            </div>
          </div>
        ) : (
          <div className={styles.modalBody}>
            <div className={styles.formElement}>
              <CustomInput
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                className={errors.categoryName ? styles.error : ""}
                placeholder="Nazwa kategorii"
              />
              {errors.categoryName && (
                <p className={styles.error}>{errors.categoryName}</p>
              )}
            </div>
            <div className={styles.formElement}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Opis kategorii"
                rows={3}
              />
            </div>
            <div className={styles.formElement}>
              <label className={styles.label}>Zdjęcie</label>
              <label htmlFor="file-upload" className={styles.customFileUpload}>
                Prześlij nowe zdjęcie
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png,image/avif"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              {errors.img && <p className={styles.error}>{errors.img}</p>}
              {formData.imgPreview && (
                <div>
                  <img
                    src={formData.imgPreview}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal.Body>
      {!isSubmitting && (
        <Modal.Footer className={styles.modalButtons}>
          <button onClick={handleSubmit} className={styles.modalConfirmBut}>
            Zapisz
          </button>
          <button onClick={handleClose} className={styles.modalCancelBut}>
            Anuluj
          </button>
        </Modal.Footer>
      )}
    </Modal>
  );
}
