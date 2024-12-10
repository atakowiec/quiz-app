import { ChangeEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "../styles/CreateQuestionModal.module.scss";
import CustomInput from "../../../../components/CustomInput";
import MainTitle from "../../../../components/MainTitle";
import { toast } from "react-toastify";
import {
  CreateQuestionRequest,
  QuestionService,
} from "../../../../api/QuestionService";
import getApi from "../../../../api/axios.ts";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import {
  globalDataActions,
  useGlobalData,
} from "../../../../store/globalDataSlice.ts";
import { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";

// Add interface for category select
interface ICategorySelect {
  value: string;
  label: string;
}

export interface QuestionFormData {
  id?: number;
  question: string;
  photo?: File | null;
  imgPreview: string;
  correctAnswer: string;
  distractors: { content: string }[];
  category: { id?: number; name: string }[];
  isActive?: boolean;
}

interface EditQuestionModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onConfirm: (data: QuestionFormData) => void;
  question: QuestionFormData; // The existing question to be edited
}

export default function EditQuestionModal({
  show,
  setShow,
  onConfirm,
  question,
}: EditQuestionModalProps) {
  const api = getApi();
  const categories = useGlobalData().categories;
  const dispatch = useDispatch();
  const [selectedCategories, setSelectedCategories] = useState<
    ICategorySelect[] | undefined
  >(undefined);

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
    categories?: string;
  }>({
    question: "",
    correctAnswer: "",
    distractors: ["", "", ""],
  });

  // Prepare categories data for select
  const categoriesData = categories.map((category) => ({
    value: category.name,
    label: category.name.toUpperCase(),
  }));
  const animatedComponents = makeAnimated();

  // Populate form data when question prop changes
  useEffect(() => {
    if (question) {
      setFormData({
        id: question.id,
        question: question.question,
        correctAnswer: question.correctAnswer,
        photo: null,
        imgPreview: question.imgPreview || "",
        distractors:
          question.distractors.length > 0
            ? question.distractors
            : [{ content: "" }, { content: "" }, { content: "" }],
        category: question.category,
      });

      // Set initial selected categories
      const initialSelectedCategories = question.category.map((cat) => ({
        value: cat.name,
        label: cat.name.toUpperCase(),
      }));
      setSelectedCategories(initialSelectedCategories);
    }
  }, [question, show]);

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
    index?: number,
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
        distractor.content.trim() ? "" : "Proszę podać błędną odpowiedź",
      ),
      categories:
        !selectedCategories || selectedCategories.length === 0
          ? "Proszę wybrać przynajmniej jedną kategorię"
          : "",
    };

    setErrors(newErrors);

    return (
      !newErrors.question &&
      !newErrors.correctAnswer &&
      !newErrors.distractors.some((error) => error) &&
      !newErrors.categories
    );
  };

  const handleConfirm = async () => {
    const validDistractors = formData.distractors.filter(
      (distractor) => distractor.content.trim() !== "",
    );

    if (validDistractors.length !== 3) {
      setErrors((prev) => ({
        ...prev,
        distractors: Array(3).fill("Prosze podać 3 błędne odpowiedzi"),
      }));
      return;
    }

    // Validate all fields including categories
    if (!validateFields()) {
      return;
    }

    try {
      setIsUploading(true);
      let photoUrl: string | undefined = formData.imgPreview;

      // Upload new photo if present
      if (formData.photo) {
        photoUrl = await QuestionService.uploadImage(formData.photo);
      }

      const questionData: CreateQuestionRequest = {
        id: formData.id,
        question: formData.question,
        correctAnswer: formData.correctAnswer,
        distractors: formData.distractors,
        category: selectedCategories
          ? selectedCategories.map((category) => ({ name: category.value }))
          : [],
        photo: photoUrl,
      };

      // Use update method instead of create
      await QuestionService.updateQuestion(questionData);

      getApi()
        .get("/categories")
        .then((response: AxiosResponse) => {
          dispatch(globalDataActions.setData({ categories: response.data }));
        })
        .catch(() => {
          toast.error("Podczas pobierania kategorii wystąpił błąd");
        });

      onConfirm({
        ...formData,
        imgPreview: photoUrl || formData.imgPreview,
        category: questionData.category,
      });

      toast.success("Pytanie zostało zaktualizowane");
      handleClose();
    } catch (error) {
      if (error as Error) {
        toast.error("Nie udało się zaktualizować pytania");
      }
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
    setSelectedCategories(undefined);
    setShow(false);
  };

  const changeStatus = async () => {
    try {
      await api.delete(`/questions/${question.id}`);
      getApi()
        .get("/categories")
        .catch(() => {
          toast.error("Podczas zmiany statusu pytania wystąpił błąd");
        });
      toast.success("Pomyślnie zmieniono status pytania");
    } catch (error) {
      if (error as Error) {
        toast.error("Wystąpił błąd podczas zmiany statusu pytania");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <MainTitle>Edytuj pytanie</MainTitle>

        <div className={styles.formElement}>
          <h4 className={styles.formLabel}>Kategorie</h4>
          <CreatableSelect
            components={animatedComponents}
            closeMenuOnSelect={false}
            isMulti
            isClearable
            value={selectedCategories}
            options={categoriesData}
            placeholder={"Wybierz kategorie"}
            className={styles.select}
            name={"categories"}
            onChange={(selectedOptions) => {
              setSelectedCategories(selectedOptions as ICategorySelect[]);
              // Clear category error when selection changes
              setErrors((prev) => ({
                ...prev,
                categories: "",
              }));
            }}
          />
          {errors.categories && (
            <p className={styles.error}>{errors.categories}</p>
          )}
        </div>

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
        {(question.photo || formData.imgPreview) && (
          <div className={styles.formElement}>
            <label className={styles.label}>Zdjęcie</label>
            <label htmlFor="file-upload" className={styles.customFileUpload}>
              Zmień zdjęcie
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
              <div className={styles.imgCenter}>
                <img
                  src={formData.imgPreview}
                  alt="Preview"
                  className={styles.previewImage}
                />
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className={styles.modalButtons}>
        <button
          onClick={handleConfirm}
          className={styles.modalConfirmBut}
          disabled={isUploading}
        >
          {isUploading ? "Aktualizowanie..." : "Zaktualizuj"}
        </button>
        <button onClick={handleClose} className={styles.modalCancelBut}>
          Anuluj
        </button>
        <button onClick={changeStatus} className={styles.modalChangeStatusBut}>
          {question.isActive ? "Deaktywuj" : "Aktywuj"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
