import { Pagination } from "../../../../components/admin/Pagination";

/**
 * Users Pagination Component
 * Wrapper around generic Pagination component
 */
export const UsersPagination = ({ page, pageSize, totalItems, onChangePage }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={pageSize}
      onPageChange={onChangePage}
    />
  );
};

export default UsersPagination;
