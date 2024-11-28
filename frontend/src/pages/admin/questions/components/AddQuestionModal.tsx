import { useState, ChangeEvent } from "react";
import { Modal } from "react-bootstrap";
import styles from "../../categories/styles/CreateCategoryModal.module.scss";
import CustomInput from "../../../../components/CustomInput";
import MainTitle from "../../../../components/MainTitle";
import { toast } from "react-toastify";
import {
  CreateQuestionRequest,
  QuestionService,
} from "../../../../api/QuestionService";

export interface QuestionFormData {
  question: string;
  photo?: File | null;
  imgPreview: string;
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
    photo: null,
    imgPreview: "",
    distractors: [{ content: "" }, { content: "" }, { content: "" }],
    category: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{
    question: string;
    photo?: string;
    imgPreview?: string;
    correctAnswer: string;
    distractors: string[];
  }>({
    question: "",
    correctAnswer: "",
    distractors: ["", "", ""],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Image type validation
      if (!file.type.match(/^image\/(jpeg|png|avif)$/)) {
        setErrors((prev) => ({
          ...prev,
          photo: "Zdjęcie musi być w formacie JPEG, PNG lub AVIF",
        }));
        return;
      }

      // File size validation (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "Zdjęcie nie może przekraczać 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: file,
          imgPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({
        ...prev,
        photo: "",
      }));
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
      question: formData.question.trim() ? "" : "Proszę podać treść pytania",
      correctAnswer: formData.correctAnswer.trim()
        ? ""
        : "Proszę podać poprawną odpowiedź",
      distractors: formData.distractors.map((distractor) =>
        distractor.content.trim() ? "" : "Proszę podać błędną odpowiedź"
      ),
    };

    setErrors(newErrors);

    return (
      !newErrors.question &&
      !newErrors.correctAnswer &&
      !newErrors.distractors.some((error) => error)
    );
  };

  const handleConfirm = async () => {
    const validDistractors = formData.distractors.filter(
      (distractor) => distractor.content.trim() !== ""
    );

    if (validDistractors.length !== 3) {
      setErrors((prev) => ({
        ...prev,
        distractors: Array(3).fill("Prosze podać 3 błędne odpowiedzi"),
      }));
      return;
    }

    if (!validateFields()) {
      return;
    }

    try {
      setIsUploading(true);
      let photoUrl: string | undefined;

      // Upload photo if present
      if (formData.photo) {
        photoUrl = await QuestionService.uploadImage(formData.photo);
      }

      const questionData: CreateQuestionRequest = {
        question: formData.question,
        correctAnswer: formData.correctAnswer,
        distractors: formData.distractors,
        category: [{ name: categoryName }],
        photo: photoUrl,
      };

      await QuestionService.createQuestion(questionData);

      onConfirm({
        ...formData,
        imgPreview: photoUrl || formData.imgPreview,
      });

      toast.success("Pytanie zostało dodane");
      handleClose();
    } catch (error) {
      toast.error("Nie udało się dodać pytania");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      question: "",
      correctAnswer: "",
      photo: null,
      imgPreview: "",
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
        <MainTitle>Dodaj pytanie</MainTitle>
        <div className={styles.formElement}>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Pytanie"
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
          <h4 className={styles.distractors}>Błędne odpowiedzi</h4>
          {formData.distractors.map((distractor, index) => (
            <div
              key={index}
              className={`${styles.formElement} ${
                errors.distractors[index] ? styles.error : ""
              }`}
            >
              <CustomInput
                type="text"
                name="distractor"
                value={distractor.content}
                onChange={(e) => handleInputChange(e, index)}
                placeholder={`Błędna odpowiedź ${index + 1}`}
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
          <label className={styles.label}>Zdjęcie</label>
          <label htmlFor="file-upload" className={styles.customFileUpload}>
            Wybierz zdjęcie
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/jpeg,image/png,image/avif"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {errors.photo && <p className={styles.error}>{errors.photo}</p>}
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
      </Modal.Body>
      <Modal.Footer className={styles.modalButtons}>
        <button
          onClick={handleConfirm}
          className={styles.modalConfirmBut}
          disabled={isUploading}
        >
          {isUploading ? "Dodawanie..." : "Dodaj"}
        </button>
        <button onClick={handleClose} className={styles.modalCancelBut}>
          Anuluj
        </button>
      </Modal.Footer>
    </Modal>
  );
}