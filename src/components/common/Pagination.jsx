import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ADMIN_TEST_IDS, withIndex } from "../../constants/testIds";

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((page) => {
        return (
          page === 1 ||
          page === totalPages ||
          Math.abs(page - currentPage) <= 1
        );
      });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4" data-cy={ADMIN_TEST_IDS.PAGINATION}>
      <div className="text-xs text-gray-400" data-cy={ADMIN_TEST_IDS.PAGINATION_INFO}>
        Mostrando {startIndex + 1}-{endIndex} de {totalItems}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-800 p-2 text-xs hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          title="Página anterior"
          data-cy={ADMIN_TEST_IDS.PAGINATION_PREV}
        >
          <FiChevronLeft />
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx, arr) => {
            const prevPage = arr[idx - 1];
            const showEllipsis = prevPage && page - prevPage > 1;

            return (
              <div key={page} className="flex items-center gap-1">
                {showEllipsis && (
                  <span className="px-2 text-xs text-gray-400">
                    …
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`min-w-[32px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    currentPage === page
                      ? "bg-[var(--blackpos-primary)] text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  data-cy={withIndex(ADMIN_TEST_IDS.PAGINATION_PAGE, page)}
                >
                  {page}
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-800 p-2 text-xs hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          title="Página siguiente"
          data-cy={ADMIN_TEST_IDS.PAGINATION_NEXT}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};
