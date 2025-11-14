import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  fetchUsers as apiFetchUsers,
  fetchUserById as apiFetchUserById,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  changeUserRole as apiChangeUserRole,
  blockUser as apiBlockUser,
  unblockUser as apiUnblockUser,
  deactivateUser as apiDeactivateUser,
  activateUser as apiActivateUser,
  resetUserPassword as apiResetUserPassword,
  deleteUser as apiDeleteUser,
} from './api/usersApi';
import { mapUserFromApi, mapUsersFromApi } from './utils/userMappers';

/**
 * Users Redux Slice
 * Manages users state in Redux store
 */

const initialState = {
  // List view
  users: [],
  filters: {
    search: '',
    status: 'all',
    role: 'all',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,

  // Detail view
  currentUser: null,
  isLoadingDetail: false,
  detailError: null,

  // Operations
  isSubmitting: false,
  submitError: null,
};

// Async Thunks

/**
 * Fetch users list with filters
 */
export const getUsersList = createAsyncThunk(
  'users/getUsersList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiFetchUsers(params);
      return {
        users: mapUsersFromApi(response.data || response.users || response),
        meta: response.meta,
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cargar usuarios';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single user by ID
 */
export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiFetchUserById(userId);
      return mapUserFromApi(response.data || response);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cargar usuario';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new user
 */
export const createNewUser = createAsyncThunk(
  'users/createUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiCreateUser(payload);
      const user = mapUserFromApi(response.data || response);
      toast.success('Usuario creado exitosamente');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear usuario';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Update existing user
 */
export const updateExistingUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateUser(userId, payload);
      const user = mapUserFromApi(response.data || response);
      toast.success('Usuario actualizado exitosamente');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar usuario';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Change user role
 */
export const changeRole = createAsyncThunk(
  'users/changeRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await apiChangeUserRole(userId, role);
      const user = mapUserFromApi(response.data || response);
      toast.success('Rol actualizado exitosamente');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cambiar rol';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Block user
 */
export const blockUserAccount = createAsyncThunk(
  'users/blockUser',
  async ({ userId, reason }, { rejectWithValue }) => {
    try {
      const response = await apiBlockUser(userId, reason);
      const user = mapUserFromApi(response.data || response);
      toast.success('Usuario bloqueado exitosamente');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al bloquear usuario';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Unblock user
 */
export const unblockUserAccount = createAsyncThunk(
  'users/unblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiUnblockUser(userId);
      const user = mapUserFromApi(response.data || response);
      toast.success('Usuario desbloqueado exitosamente');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al desbloquear usuario';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Deactivate user
 */
export const deactivateUserAccount = createAsyncThunk(
  'users/deactivateUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiDeactivateUser(userId);
      const user = mapUserFromApi(response.data || response);
      toast.success('Usuario desactivado exitosamente');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al desactivar usuario';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Activate user
 */
export const activateUserAccount = createAsyncThunk(
  'users/activateUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiActivateUser(userId);
      const user = mapUserFromApi(response.data || response);
      toast.success('Usuario activado exitosamente');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al activar usuario';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Reset user password
 */
export const resetPassword = createAsyncThunk(
  'users/resetPassword',
  async ({ userId, newPassword }, { rejectWithValue }) => {
    try {
      await apiResetUserPassword(userId, newPassword);
      toast.success('Contraseña restablecida exitosamente');
      return userId;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al restablecer contraseña';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete user
 */
export const removeUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await apiDeleteUser(userId);
      toast.success('Usuario eliminado exitosamente');
      return userId;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al eliminar usuario';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Slice

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.detailError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.detailError = null;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get users list
      .addCase(getUsersList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        if (action.payload.meta) {
          state.pagination = {
            page: action.payload.meta.page || state.pagination.page,
            pageSize: action.payload.meta.pageSize || state.pagination.pageSize,
            total: action.payload.meta.total || action.payload.users.length,
            totalPages: action.payload.meta.totalPages || Math.ceil(action.payload.users.length / state.pagination.pageSize),
          };
        }
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.isLoadingDetail = true;
        state.detailError = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.currentUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.detailError = action.payload;
      })

      // Create user
      .addCase(createNewUser.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Optionally add to list if on first page
        if (state.pagination.page === 1) {
          state.users.unshift(action.payload);
        }
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
      })

      // Update user
      .addCase(updateExistingUser.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(updateExistingUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Update in list
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        // Update current user if it's the same
        if (state.currentUser?._id === action.payload._id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateExistingUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
      })

      // Change role, block, unblock, activate, deactivate - all update user
      .addCase(changeRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
        if (state.currentUser?._id === action.payload._id) state.currentUser = action.payload;
      })
      .addCase(blockUserAccount.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
        if (state.currentUser?._id === action.payload._id) state.currentUser = action.payload;
      })
      .addCase(unblockUserAccount.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
        if (state.currentUser?._id === action.payload._id) state.currentUser = action.payload;
      })
      .addCase(deactivateUserAccount.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
        if (state.currentUser?._id === action.payload._id) state.currentUser = action.payload;
      })
      .addCase(activateUserAccount.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
        if (state.currentUser?._id === action.payload._id) state.currentUser = action.payload;
      })

      // Delete user
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
        if (state.currentUser?._id === action.payload) {
          state.currentUser = null;
        }
      });
  },
});

export const { setFilters, setPagination, clearCurrentUser, clearError } = usersSlice.actions;

export default usersSlice.reducer;
