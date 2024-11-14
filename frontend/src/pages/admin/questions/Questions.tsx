import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import useApi from "../../../api/useApi";
import { useParams } from "react-router-dom";
import { ICategory } from "@shared/game";
import QuestionElement from "./components/QuestionElement";
import styles from "./questions.module.scss";

export interface Pagination {
  questions: Question[];
  totalQuestions: number;
}

export interface Question {
  id: number;
  question: string;
  category: ICategory[];
  correctAnswer: string;
  distractors: Distractor[];
}

export interface Distractor {
  id: number;
  content: string;
}

export default function Questions() {
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const maxVisiblePages = 5;

  // Determine API path based on whether there is a search term
  const apiPath = searchTerm
    ? `/questions/paginate/${categoryName}/1?limit=${questionsPerPage}&content=${searchTerm}`
    : `/questions/paginate/${categoryName}/${currentPage}?limit=${questionsPerPage}`;

  // Use useApi with the dynamically determined path
  const { data, error, loaded } = useApi<Pagination>(apiPath, "get");

  // Update state with fetched questions and pagination
  const questions = data?.questions || [];
  const totalPages = Math.ceil((data?.totalQuestions || 0) / questionsPerPage);

  // Debounced search effect for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setSearchTerm(searchTerm); // Triggers useApi to re-fetch with updated search term
      } else {
        setCurrentPage(1); // Reset to first page if search is cleared
      }
    }, 50); // 50ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
        <Pagination.First key="first" onClick={() => handlePageChange(1)} />
      );
    }

    if (currentPage > 1) {
      items.push(
        <Pagination.Prev
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
        />
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
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
        />
      );
    }

    if (endPage < totalPages) {
      items.push(
        <Pagination.Last
          key="last"
          onClick={() => handlePageChange(totalPages)}
        />
      );
    }

    return items;
  };

  return (
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
          />
        ))}
      </ul>
      {!searchTerm && (
        <Pagination className={styles.pagination}>
          {renderPagination()}
        </Pagination>
      )}
    </div>
  );
}
