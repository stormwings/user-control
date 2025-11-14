import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from '../auth/authService'
import { toast } from 'react-toastify'
import { saveUser, getUser, removeUser } from '../../utils/localStorage'

const user = getUser()

const initialState = {
    user: user ? user : null,
    users: [],
    error: false,
    loading: false,
    message: ''
}

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al registrar usuario';
      return thunkAPI.rejectWithValue(message)
    }
})

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
      return await authService.login(user)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
      return await authService.logout()
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al cerrar sesión';
      return thunkAPI.rejectWithValue(message)
    }
})

export const allUsers = createAsyncThunk('auth/allUsers', async (_, thunkAPI) => {
    try {
      return await authService.allUsers()
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al cargar usuarios';
      return thunkAPI.rejectWithValue(message)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false
            state.error = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.loading = true
            state.error = false
            state.message = ''
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false
            state.error = false
            toast.success('Usuario registrado exitosamente')
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false
            state.error = true
            state.message = action.payload
            state.user = null
            toast.error(action.payload)
        })
        .addCase(login.pending, (state) => {
            state.loading = true
            state.error = false
            state.message = ''
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false
            state.error = false
            state.user = action.payload
            saveUser(action.payload)
            toast.success('Sesión iniciada exitosamente')
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false
            state.error = true
            state.message = action.payload
            state.user = null
            toast.error(action.payload)
        })
        .addCase(logout.pending, (state) => {
            state.loading = true
        })
        .addCase(logout.fulfilled, (state) => {
            state.loading = false
            state.user = null
            removeUser()
            toast.success('Sesión cerrada exitosamente')
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false
            state.error = true
            state.message = action.payload
            toast.error(action.payload)
        })
        .addCase(allUsers.pending, (state) => {
            state.loading = true
            state.error = false
        })
        .addCase(allUsers.fulfilled, (state, action) => {
            state.loading = false
            state.users = action.payload
        })
        .addCase(allUsers.rejected, (state, action) => {
            state.loading = false
            state.error = true
            state.message = action.payload
            toast.error(action.payload)
        })
    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer
