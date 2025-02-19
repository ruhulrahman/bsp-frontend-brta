import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import { useSelector } from 'react-redux';

const PaginationComponent = ({ onPageChange }) => {
const { t } = useTranslation();

    const { pagination } = useSelector((state) => state.common)

    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    let items = [];

    items.push(
        <Pagination.First
            key="first"
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
        />
    );

    items.push(
        <Pagination.Prev
            key="prev"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
        />
    );

    // Ellipsis Logic (similar to previous example)
    const windowSize = 5;
    const maxLeft = Math.max(currentPage - Math.floor(windowSize / 2), 0);
    const maxRight = Math.min(currentPage + Math.floor(windowSize / 2), totalPages - 1);

    if (maxLeft > 0) {
        items.push(
            <Pagination.Item key={0} onClick={() => onPageChange(0)}>
                1
            </Pagination.Item>
        );
        if (maxLeft > 1) {
            items.push(<Pagination.Ellipsis key="left-ellipsis" />);
        }
    }

    for (let i = maxLeft; i <= maxRight; i++) {
        items.push(
            <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => onPageChange(i)}
            >
                {i + 1}
            </Pagination.Item>
        );
    }

    if (maxRight < totalPages - 1) {
        if (maxRight < totalPages - 2) {
            items.push(<Pagination.Ellipsis key="right-ellipsis" />);
        }
        items.push(
            <Pagination.Item
                key={totalPages - 1}
                onClick={() => onPageChange(totalPages - 1)}
            >
                {totalPages}
            </Pagination.Item>
        );
    }

    items.push(
        <Pagination.Next
            key="next"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
        />
    );

    items.push(
        <Pagination.Last
            key="last"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
        />
    );

    return items
};

export default PaginationComponent
