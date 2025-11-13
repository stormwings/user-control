export const selectUserIsAdmin = (state) => state.auth?.user?.admin || false;

export const selectUsers = (state) => state.auth?.users || [];
