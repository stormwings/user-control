# Error Handling Architecture

This document describes the comprehensive error handling strategy implemented across the application.

## Overview

The application uses a layered approach to error handling:

1. **Global Level** - ErrorBoundary and Axios Interceptors
2. **Redux Level** - Thunks with error handling
3. **Component Level** - Try-catch blocks and error states
4. **Form Level** - Validation and error display

## 1. Global Error Handling

### Error Boundary (`src/components/ErrorBoundary.jsx`)

React Error Boundary catches JavaScript errors anywhere in the component tree:

```jsx
<ErrorBoundary>
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
</ErrorBoundary>
```

**Features:**
- Catches React rendering errors
- Shows user-friendly error UI
- Provides error details in development mode
- Allows users to retry or navigate home
- Logs errors to console for debugging

### Axios Interceptors (`src/utils/request.js`)

Centralized HTTP error handling for all API requests:

**Request Interceptor:**
- Logs requests in development mode
- Can add authentication tokens globally

**Response Interceptor:**
- Handles network errors
- Handles HTTP status codes (401, 403, 404, 500, 503)
- Shows appropriate toast messages
- Logs all errors for debugging

**Error Codes Handled:**
- `400` - Bad Request (component handles specific validation)
- `401` - Unauthorized (session expired)
- `403` - Forbidden (no permissions)
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error (component handles)
- `500` - Internal Server Error
- `503` - Service Unavailable
- Network errors (no internet connection)

## 2. Redux Error Handling

### Auth Slice (`src/features/auth/authSlice.js`)

All async thunks follow this pattern:

```javascript
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Default error';
    return thunkAPI.rejectWithValue(message);
  }
});
```

**Features:**
- Extracts error messages from response
- Provides fallback error messages
- Returns rejected values for components to handle
- Updates loading states (pending/fulfilled/rejected)
- Shows toast notifications

### Users Slice (`src/features/users/usersSlice.js`)

Comprehensive Redux state management for users:

**Async Thunks:**
- `getUsersList` - Fetch users with filters/pagination
- `getUserById` - Fetch single user
- `createNewUser` - Create new user
- `updateExistingUser` - Update user
- `changeRole` - Change user role
- `blockUserAccount` - Block user
- `unblockUserAccount` - Unblock user
- `deactivateUserAccount` - Deactivate user
- `activateUserAccount` - Activate user
- `resetPassword` - Reset user password
- `removeUser` - Delete user

**State Management:**
- Separate loading states for list, detail, and operations
- Separate error states for better granularity
- Updates local state on successful operations
- Shows toast notifications

## 3. Service Layer Error Handling

### Auth Service (`src/features/auth/authService.js`)

All service functions wrap API calls in try-catch:

```javascript
const login = async (user) => {
  try {
    const response = await httpRequest.post("/auth/login", user);
    return response.data;
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};
```

### Users API (`src/features/users/api/usersApi.js`)

Same pattern for all 12+ user operations:

```javascript
export async function fetchUsers(params = {}) {
  try {
    const response = await httpRequest.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch users error:', error);
    throw error;
  }
}
```

**Benefits:**
- Centralized error logging
- Re-throws errors for thunks to handle
- Preserves error context

## 4. Component Level Error Handling

### Page Components

**Login/Register Pages:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await dispatch(login({ email, password })).unwrap();
    // Success handled by useEffect
  } catch (error) {
    console.error('Login error:', error);
    // Error shown by interceptor and thunk
  }
};
```

**User Detail Page:**
- Shows loading spinner while fetching
- Shows error message if user not found
- Handles all operations with try-catch
- Refreshes data after operations

**User Create/Edit Pages:**
- Form validation before submission
- Try-catch in submit handlers
- Navigates on success
- Errors shown via toast

### Custom Hooks

**useUserMutations:**
- Wraps all mutation operations
- Handles loading state
- Handles errors with toast
- Returns operation functions

**useUsersList:**
- Fetches users with filters
- Manages pagination
- Handles loading and error states
- Shows toast on errors

**useUserDetail:**
- Fetches single user
- Fetches audit log
- Handles errors gracefully
- Provides refresh function

## 5. Form Level Validation

### UserForm Component

Client-side validation:
- Required field validation
- Email format validation
- Password length validation (min 6 chars)
- Shows inline error messages
- Prevents submission if validation fails

```javascript
const validate = () => {
  const newErrors = {};
  
  if (!values.name?.trim()) {
    newErrors.name = 'El nombre es requerido';
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    newErrors.email = 'Correo electrónico inválido';
  }
  
  return Object.keys(newErrors).length === 0;
};
```

## 6. Loading States

### Components

**Loading Component** (`src/components/Loading.jsx`):
- Reusable loading spinner
- Multiple sizes (sm, md, lg, xl)
- Optional message
- Full-screen option

**LoadingOverlay** (`src/components/LoadingOverlay.jsx`):
- Full-screen blocking overlay
- Used for critical operations
- Shows message while loading

### Usage Patterns

```javascript
// Page-level loading
if (isLoading) {
  return <Loading fullScreen message="Cargando usuario..." />;
}

// Section-level loading
{isLoading ? <Loading size="md" /> : <UsersList users={users} />}

// Button loading
<button disabled={isLoading}>
  {isLoading ? 'Guardando...' : 'Guardar'}
</button>
```

## 7. User Feedback

### Toast Notifications

All operations show user feedback via `react-toastify`:

**Success:**
- ✅ "Usuario creado exitosamente"
- ✅ "Sesión iniciada exitosamente"
- ✅ "Rol actualizado exitosamente"

**Errors:**
- ❌ "Error al cargar usuarios"
- ❌ "Sesión expirada. Por favor inicia sesión nuevamente"
- ❌ "No tienes permisos para realizar esta acción"

**Locations:**
- Redux thunks (fulfilled/rejected)
- Axios interceptors (network/HTTP errors)
- Custom hooks (operation results)

## 8. Error Recovery Patterns

### Retry Mechanisms

- ErrorBoundary has "Retry" button
- List pages have refresh button
- Detail pages have refresh function
- Failed operations can be retried

### Graceful Degradation

- Show cached data if available
- Show partial UI if some data loads
- Allow navigation even if some features fail
- Logout clears state even if server call fails

## 9. Best Practices

### Do's ✅

1. Always wrap async operations in try-catch
2. Extract meaningful error messages
3. Provide fallback error messages
4. Log errors for debugging
5. Show user-friendly messages
6. Clear error state when appropriate
7. Handle loading states
8. Validate input before submission
9. Use TypeScript types for better error handling (future)

### Don'ts ❌

1. Don't suppress errors silently
2. Don't show technical errors to users
3. Don't forget to clear loading states
4. Don't leave users without feedback
5. Don't duplicate error handling logic
6. Don't forget network error cases
7. Don't block UI indefinitely on errors

## 10. Testing Error Scenarios

### Manual Testing Checklist

- [ ] Network error (disconnect internet)
- [ ] 401 Unauthorized (invalid token)
- [ ] 403 Forbidden (insufficient permissions)
- [ ] 404 Not Found (invalid resource)
- [ ] 500 Server Error (server crash)
- [ ] Validation errors (invalid form data)
- [ ] Component errors (throw in render)
- [ ] Concurrent requests
- [ ] Timeout scenarios
- [ ] Invalid data format

### Automated Testing (Future)

Consider adding:
- Unit tests for error handling in services
- Integration tests for error flows
- E2E tests for critical error scenarios
- Error boundary tests
- Interceptor tests

## 11. Monitoring and Logging

### Current Implementation

- Console logging in development
- Error details in ErrorBoundary (dev mode)
- Request/response logging in interceptors (dev mode)

### Future Improvements

Consider integrating:
- Sentry or similar error tracking service
- Analytics for error rates
- User session replay for debugging
- Error reports to backend
- Performance monitoring

## Summary

The application has comprehensive error handling at all levels:

1. **Global** - ErrorBoundary + Axios Interceptors
2. **Redux** - Thunks with error states
3. **Service** - Try-catch in all API calls
4. **Component** - Loading/error states + try-catch
5. **Form** - Validation with inline errors
6. **User** - Toast notifications + helpful messages

This ensures users always receive appropriate feedback and the application degrades gracefully when errors occur.
