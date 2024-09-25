import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import useApi from "../../../api/useApi";
import { useParams } from "react-router-dom";
import { ICategory } from "@shared/game";
import QuestionElement from "./components/QuestionElement";
import classes from "./questions.module.scss";
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

  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const questionsPerPage = 10;
  const maxVisiblePages = 5;

  const fetchedQuestions = useApi(
    `/questions/paginate/${categoryName}/${currentPage}?limit=${questionsPerPage}`,
    "get"
  );

  console.log(fetchedQuestions);

  useEffect(() => {
    if (fetchedQuestions && fetchedQuestions.data) {
      console.log(fetchedQuestions.data.questions);
      setQuestions(fetchedQuestions.data.questions);
      setTotalPages(
        Math.ceil(fetchedQuestions.data.totalQuestions / questionsPerPage)
      );
    }
  }, [fetchedQuestions]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
    <div className={`container mx-auto p-4 ${classes.context}`}>
      <h1 className={`text-2xl font-bold mb-4`}>
        Questions from {categoryName}
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for a question"
          className={classes.searchBar}
        />
      </div>
      <ul className={`list-unstyled flex ${classes.questions}`}>
        {questions.map((question: Question) =>
          QuestionElement({
            question: question.question,
            correctAnswer: question.correctAnswer,
            distractors: question.distractors,
          })
        )}
      </ul>
      <Pagination>{renderPagination()}</Pagination>
    </div>
  );
}
