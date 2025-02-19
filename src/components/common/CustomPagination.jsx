import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            onPageChange(page);
        }
    };

    return (
        <Pagination size="sm">
            <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
            {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i + 1}
                </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} />
        </Pagination>
    );
};

export default CustomPagination;