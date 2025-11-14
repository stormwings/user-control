import { useMemo, useState, useCallback } from 'react';

export const useUserFilters = (users) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isInactive = useCallback((user) => {
    return (
      user?.disabled === true ||
      user?.isDisabled === true ||
      user?.status === 'INACTIVE' ||
      user?.active === false
    );
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (filter === 'active') {
      filtered = filtered.filter((user) => !isInactive(user));
    } else if (filter === 'inactive') {
      filtered = filtered.filter((user) => isInactive(user));
    } else if (filter === 'admin') {
      filtered = filtered.filter((user) => !!user.isAdmin);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [users, filter, searchQuery, isInactive]);

  return {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    isInactive,
  };
};
