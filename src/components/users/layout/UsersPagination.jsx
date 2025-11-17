import { Pagination } from "../../common/Pagination";

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
