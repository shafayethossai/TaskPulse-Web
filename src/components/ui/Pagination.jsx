export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 pt-4">
            <button 
                onClick={() => onPageChange(page - 1)}
                disabled= {page <= 1}
                className="px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
            >
                Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i+1).map((pageNum) => (
                <button 
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1.5 border rounded text-sm font-medium ${
                        pageNum === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    {pageNum}

                </button>
            ))}

            <button 
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
