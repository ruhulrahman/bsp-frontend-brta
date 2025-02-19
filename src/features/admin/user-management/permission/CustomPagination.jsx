const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-2 mx-1 ${
                        currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    } rounded`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default CustomPagination;
