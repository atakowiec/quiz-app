import { useState, ChangeEvent } from "react";
import { Modal } from "react-bootstrap";
import styles from "../../categories/styles/CreateCategoryModal.module.scss";
import CustomInput from "../../../../components/CustomInput";
import MainTitle from "../../../../components/MainTitle";

export interface QuestionFormData {
  question: string;
  photo?: string;
  correctAnswer: string;
  distractors: { content: string }[];
  category: { id?: number; name: string }[];
}

interface AddQuestionModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onConfirm: (data: QuestionFormData) => void;
  categoryName: string;
}

export default function AddQuestionModal({
  show,
  setShow,
  onConfirm,
  categoryName,
}: AddQuestionModalProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    question: "",
    correctAnswer: "",
    photo: undefined,
    distractors: [{ content: "" }, { content: "" }, { content: "" }],
    category: [],
  });

  const [errors, setErrors] = useState<{
    question: string;
    photo?: string;
    correctAnswer: string;
    distractors: string[];
  }>({
    question: "",
    correctAnswer: "",
    distractors: ["", "", ""],
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photo: "Nieprawidłowy typ pliku. Dozwolone są JPG, PNG i GIF.",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          photo: "Plik jest za duży. Maksymalny rozmiar to 5MB.",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result as string,
        }));
        setErrors((prev) => ({
          ...prev,
          photo: undefined,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedDistractors = [...formData.distractors];
      updatedDistractors[index] = { content: value };

      const updatedDistractorErrors = [...errors.distractors];
      updatedDistractorErrors[index] = "";

      setFormData((prev) => ({
        ...prev,
        distractors: updatedDistractors,
      }));

      setErrors((prev) => ({
        ...prev,
        distractors: updatedDistractorErrors,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateFields = (): boolean => {
    const newErrors = {
      question: formData.question.trim() ? "" : "Proszę wpisać treść pytania.",
      correctAnswer: formData.correctAnswer.trim()
        ? ""
        : "Proszę wpisać poprawną odpowiedź.",
      distractors: formData.distractors.map((distractor) =>
        distractor.content.trim() ? "" : "Proszę wpisać dystraktor."
      ),
    };

    setErrors(newErrors);

    return (
      !newErrors.question &&
      !newErrors.correctAnswer &&
      !newErrors.distractors.some((error) => error)
    );
  };

  const handleConfirm = () => {
    // Populate category with current category name
    const questionData = {
      ...formData,
      category: [{ name: categoryName }],
    };

    if (!validateFields()) {
      return;
    }
    onConfirm(questionData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      question: "",
      correctAnswer: "",
      photo: undefined,
      distractors: [{ content: "" }, { content: "" }, { content: "" }],
      category: [],
    });
    setErrors({
      question: "",
      correctAnswer: "",
      distractors: ["", "", ""],
    });
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <MainTitle>Dodaj pytanie </MainTitle>
        <div className={styles.formElement}>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Treść pytania"
            rows={3}
          />
          {errors.question && <p className={styles.error}>{errors.question}</p>}
        </div>
        <div
          className={`${styles.formElement} ${
            errors.correctAnswer ? styles.error : ""
          }`}
        >
          <CustomInput
            type="text"
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={handleInputChange}
            placeholder="Poprawna odpowiedź"
          />
          {errors.correctAnswer && (
            <p className={styles.errorMessage}>{errors.correctAnswer}</p>
          )}
        </div>
        <div>
          <h4 className={styles.distractors}>Dystraktory</h4>
          {formData.distractors.map((distractor, index) => (
            <div
              key={index}
              className={`${styles.formElement} ${
                errors.distractors[index] ? styles.error : ""
              }`}
            >
              {" "}
              <CustomInput
                type="text"
                name="distractor"
                value={distractor.content}
                onChange={(e) => handleInputChange(e, index)}
                placeholder={`Dystraktor ${index + 1}`}
              />
              {errors.distractors[index] && (
                <p className={styles.errorMessage}>
                  {errors.distractors[index]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className={styles.formElement}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {errors.photo && <p className={styles.error}>{errors.photo}</p>}
          {formData.photo && (
            <div className={styles.imagePreview}>
              <img
                src={formData.photo}
                alt="Podgląd"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.modalButtons}>
        <button onClick={handleConfirm} className={styles.modalConfirmBut}>
          Dodaj
        </button>
        <button onClick={handleClose} className={styles.modalCancelBut}>
          Anuluj
        </button>
      </Modal.Footer>
    </Modal>
  );
}
