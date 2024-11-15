import styles from "./styles/CreateCategoryModal.module.scss";
import { Modal } from "react-bootstrap";
import { ChangeEvent, useState } from "react";
import { CategoryService } from "../../../../api/categoryService.tsx";

export interface CategoryFormData {
  categoryName: string;
  description: string;
  img: File | null;
  imgPreview: string;
}

interface CategoryFormErrors {
  categoryName: string;
  img?: string;
}

type CreateCategoryModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onConfirm: (categoryData: CategoryFormData) => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  onError: (error: Error) => void;
};

export default function CreateCategoryModal(props: CreateCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
    description: "",
    img: null,
    imgPreview: "",
  });
  const [errors, setErrors] = useState<CategoryFormErrors>({
    categoryName: "",
    img: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
          img: "Please upload a valid image file (JPG, PNG, or AVIF)",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          img: "Image must be less than 5MB",
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

  const handleClose = (): void => {
    setFormData({
      categoryName: "",
      description: "",
      img: null,
      imgPreview: "",
    });
    setErrors({
      categoryName: "",
      img: "",
    });
  };

  async function confirm() {
    if (!formData.categoryName.trim()) {
      setErrors((prev) => ({
        ...prev,
        categoryName: "Category name is required",
      }));
      return;
    }

    if (!formData.img) {
      setErrors((prev) => ({
        ...prev,
        img: "Image is required",
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      await CategoryService.createCategory({
        categoryName: formData.categoryName,
        description: formData.description,
        img: formData.img,
      });

      props.onConfirm(formData);
      props.setShow(false);
      handleClose();
    } catch (error) {
      console.error("Error creating category:", error);
      props.onError(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function cancel() {
    handleClose();
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
        <Modal.Title className={styles.modalTitle}>Dodaj kategorię</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isSubmitting ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingContainer}>
              <p className={styles.loadingText}>Dodawanie kategorii...</p>
              <div className={styles.loading}></div>
            </div>
          </div>
        ) : (
          <div className={styles.modalBody}>
            <div className={styles.formElement}>
              <label className={styles.label}>Category Name *</label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                className={errors.categoryName ? styles.error : ""}
                placeholder="Enter category name"
              />
              {errors.categoryName && (
                <p className={styles.error}>{errors.categoryName}</p>
              )}
            </div>

            <div className={styles.formElement}>
              <label className={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className={styles.formElement}>
              <label className={styles.label}>Image</label>
              <label htmlFor="file-upload" className={styles.customFileUpload}>
                Upload image
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
                <div className="relative">
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
          <button onClick={confirm} className={styles.modalConfirmBut}>
            {props.confirmText ?? "Potwierdź"}
          </button>
          <button onClick={cancel} className={styles.modalCancelBut}>
            {props.cancelText ?? "Anuluj"}
          </button>
        </Modal.Footer>
      )}
    </Modal>
  );
}
