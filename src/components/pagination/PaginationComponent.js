import React, { useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";

const PaginationComponent = ({
  currentPage,
  totalPages,
  setCurrentPage,
  maxRows,
}) => {
  const pageRange = 2;
  const [jumpPage, setJumpPage] = useState("");
  const itemsPerPage = 10;

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = totalPages;

    let start = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let end = Math.min(start + totalPagesToShow - 1, totalPages);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (start > 1) {
      pageNumbers.unshift("...");
    }
    if (end < totalPages) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== "...") {
      setCurrentPage(pageNumber);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // setJumpPage(""); // Clear input after jumping
  };

  return (
    <div className="d-flex justify-content-between">
      <div style={{marginLeft:"10px"}}>
        Showing{" "}
        <strong>
          {Math.min((currentPage - 1) * itemsPerPage + 1, maxRows)}-
          {Math.min(currentPage * itemsPerPage, maxRows)}
        </strong>{" "}
        of <strong>{maxRows}</strong> items
      </div>

      <Pagination className="txt-14">
        <Pagination.First onClick={() => handlePageClick(1)} />
        <Pagination.Prev
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {generatePageNumbers()
          .filter((page) => {
            return (
              page === 1 ||
              page === totalPages ||
              page === currentPage ||
              (page >= currentPage - pageRange &&
                page <= currentPage + pageRange)
            );
          })
          .map((page, index) => (
            <Pagination.Item
              key={index}
              active={page === currentPage}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </Pagination.Item>
          ))}
        <Pagination.Next
          onClick={() => handlePageClick(Number(currentPage) + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last onClick={() => handlePageClick(totalPages)} />
      </Pagination>
      <div className="d-flex align-items-center" style={{ marginRight: "10px" }}>
        <Form.Label style={{ marginRight: "5px" }}>Jump to:</Form.Label>
        <Form.Control
          type="number"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleJumpToPage();
          }}
          style={{ width: "60px" }}
        />
      </div>
    </div>
  );
};

export default PaginationComponent;
