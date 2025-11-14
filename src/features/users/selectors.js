

export const selectUsersList = (state) => state.users?.users || [];
export const selectUsersLoading = (state) => state.users?.isLoading || false;
export const selectUsersError = (state) => state.users?.error || null;
export const selectUsersFilters = (state) => state.users?.filters || { search: '', status: 'all', role: 'all' };
export const selectUsersPagination = (state) => state.users?.pagination || { page: 1, pageSize: 10, total: 0, totalPages: 0 };

export const selectCurrentUser = (state) => state.users?.currentUser || null;
export const selectUserDetailLoading = (state) => state.users?.isLoadingDetail || false;
export const selectUserDetailError = (state) => state.users?.detailError || null;

export const selectUsersSubmitting = (state) => state.users?.isSubmitting || false;
export const selectUsersSubmitError = (state) => state.users?.submitError || null;

export const selectUsersCount = (state) => state.users?.users?.length || 0;
export const selectHasUsers = (state) => (state.users?.users?.length || 0) > 0;
