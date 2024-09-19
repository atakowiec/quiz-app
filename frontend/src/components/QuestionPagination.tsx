import React, { useState, useEffect } from "react";
import getApi from "../api/axios.ts";
const QuestionPagination = ({ page: number }) => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Questions from {site || "Unknown Site"}
      </h1>

      {questions && questions.length > 0 ? (
        <ul className="list-disc pl-5 mb-4">
          {questions.map((question, index) => (
            <li key={index} className="mb-2">
              {question.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default QuestionPagination;
