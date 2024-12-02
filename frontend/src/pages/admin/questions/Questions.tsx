import React, { useEffect, useState } from "react";
import { Breadcrumb, Pagination } from "react-bootstrap";
import useApi from "../../../api/useApi";
import { useParams } from "react-router-dom";
import { ICategory } from "@shared/game";
import QuestionElement from "./components/QuestionElement";
import styles from "./styles/Questions.module.scss";
import Meta from "../../../components/Meta";
import AddQuestionModal, {
  QuestionFormData,
} from "./components/AddQuestionModal";
import { toast } from "react-toastify";
import getApi from "../../../api/axios.ts";
import EditQuestionModal from "./components/EditQuestionModal.tsx";

export interface Question {
  id: number;
  question: string;
  category: ICategory[];
  correctAnswer: string;
  distractors: Distractor[];
  photo?: string | null;
  isActive?: boolean;
}

export interface Distractor {
  id: number;
  content: string;
}

export interface Pagination {
  questions: Question[];
  totalQuestions: number;
}

export default function Questions() {
  const api = getApi();
  const { categoryName = "" } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [, setTotalQuestions] = useState(0);
  const questionsPerPage = 10;
  const maxVisiblePages = 5;

  const encodedCategoryName = encodeURIComponent(categoryName);
  const apiPath = searchTerm
    ? `/questions/paginate/${encodedCategoryName}/1?limit=${questionsPerPage}&content=${searchTerm}`
    : `/questions/paginate/${encodedCategoryName}/${currentPage}?limit=${questionsPerPage}`;

  const { data, error } = useApi<Pagination>(apiPath, "get");

  const totalPages = Math.ceil((data?.totalQuestions || 0) / questionsPerPage);

  useEffect(() => {
    if (data) {
      setQuestions(data.questions);
      setTotalQuestions(data.totalQuestions);
    }
  }, [data]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setSearchTerm(searchTerm);
      } else {
        setCurrentPage(1);
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddQuestionConfirm = async (questionData: QuestionFormData) => {
    try {
      const newQuestion: Question = {
        id: questionData.id,
        question: questionData.question,
        correctAnswer: questionData.correctAnswer,
        distractors: questionData.distractors.map((d) => ({
          id: Math.random(),
          content: d.content,
        })),
        category: [
          {
            name: categoryName,
            id: 0, //trzeba mieć tu id kategorii
          },
        ],
        photo: questionData.imgPreview || null,
        isActive: questionData.isActive,
      };

      const updatedQuestions = [
        newQuestion,
        ...questions.slice(0, questionsPerPage - 1),
      ];

      setQuestions(updatedQuestions);
      setTotalQuestions((prev) => prev + 1);
      setShowAddQuestionModal(false);
    } catch (error) {
      toast.error("Wystąpił błąd podczas dodawania pytania");
      console.error(error);
    }
  };

  const handleEditQuestionConfirm = async (questionData: QuestionFormData) => {
    try {
      const updatedQuestions = questions.map((question) =>
        question.id === selectedQuestion?.id
          ? {
              ...question,
              question: questionData.question,
              correctAnswer: questionData.correctAnswer,
              distractors: questionData.distractors.map((d) => ({
                id: Math.random(),
                content: d.content,
              })),
              photo: questionData.imgPreview || null,
            }
          : question,
      );

      setQuestions(updatedQuestions);
      setShowEditQuestionModal(false);
      setSelectedQuestion(null);
      toast.success("Pytanie zostało zaktualizowane");
    } catch (error) {
      toast.error("Wystąpił błąd podczas aktualizacji pytania");
      console.error(error);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowEditQuestionModal(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const renderPagination = () => {
    const items = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => handlePageChange(1)} />,
      );
    }

    if (currentPage > 1) {
      items.push(
        <Pagination.Prev
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
        />,
      );
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>,
      );
    }

    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
        />,
      );
    }

    if (endPage < totalPages) {
      items.push(
        <Pagination.Last
          key="last"
          onClick={() => handlePageChange(totalPages)}
        />,
      );
    }

    return items;
  };

  async function onStatusChangeClick(id: number) {
    try {
      await api.delete(`/questions/${id}`);
      setQuestions((prev) =>
        prev.map((question) =>
          question.id === id
            ? { ...question, isActive: !question.isActive }
            : question,
        ),
      );

      toast.success("Pomyślnie zmieniono status pytania");
    } catch (error) {
      toast.error("Wystąpił błąd podczas usuwania pytania");
      console.error(error);
    }
  }

  return (
    <>
      <Meta title={"Admin"} />
      <Breadcrumb title="Admin" />
      <div className={styles.fixedButton}>
        <button
          className={styles.createQuestionBtn}
          onClick={() => setShowAddQuestionModal(true)}
        >
          Dodaj pytanie
        </button>
      </div>
      <div className={styles.questionsContainer}>
        <h1 className={styles.questionsTitle}>Pytania z {categoryName}</h1>
        <input
          type="text"
          placeholder="Wyszukaj pytanie lub odpowiedź"
          className={styles.searchBar}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {error && <p>Wystąpił błąd: {error.message}</p>}
        <ul className={`list-unstyled flex ${styles.questions}`}>
          {questions.map((question: Question) => (
            <QuestionElement
              key={question.id}
              question={question.question}
              correctAnswer={question.correctAnswer}
              distractors={question.distractors}
              onEditClick={() => handleEditQuestion(question)}
              onDeleteClick={(id: number) => {
                onStatusChangeClick(id);
              }}
              isActive={question.isActive}
              id={question.id}
            />
          ))}
        </ul>
        {!searchTerm && (
          <Pagination className={styles.pagination}>
            {renderPagination()}
          </Pagination>
        )}
      </div>
      <AddQuestionModal
        show={showAddQuestionModal}
        setShow={setShowAddQuestionModal}
        onConfirm={handleAddQuestionConfirm}
        categoryName={categoryName}
      />

      {selectedQuestion && (
        <EditQuestionModal
          show={showEditQuestionModal}
          setShow={setShowEditQuestionModal}
          onConfirm={handleEditQuestionConfirm}
          question={{
            question: selectedQuestion.question,
            correctAnswer: selectedQuestion.correctAnswer,
            imgPreview: selectedQuestion.photo || "",
            distractors: selectedQuestion.distractors.map((d) => ({
              content: d.content,
            })),
            category: selectedQuestion.category,
            id: selectedQuestion.id,
            isActive: selectedQuestion.isActive,
          }}
        />
      )}
    </>
  );
}
