# Architecture Documentation

## Project Overview

User Control is a React-based user management system built with modern web technologies for managing users, roles, and permissions.

## Technology Stack

### Core
- **React 18.2.0** - UI library
- **Redux Toolkit 1.9.3** - State management
- **React Router 6.9.0** - Client-side routing
- **Axios 1.3.4** - HTTP client

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **React Icons 4.8.0** - Icon library
- **React Toastify 9.1.2** - Toast notifications

### Development
- **React Scripts 5.0.1** - Build tooling
- **Node 16.19.0** - Required runtime

## Project Structure

```
src/
├── app/                    # Redux store configuration
│   └── store.js           # Configure store with reducers
│
├── components/            # Shared/reusable components
│   ├── ui/               # Basic UI components (Button, Input, Card, Chip)
│   ├── admin/            # Admin-specific components
│   ├── ErrorBoundary.jsx # Global error boundary
│   ├── Loading.jsx       # Loading spinner
│   ├── LoadingOverlay.jsx # Full-screen loading
│   ├── SidebarLeft.jsx   # Navigation sidebar
│   ├── ThemeToggle.jsx   # Theme switcher
│   └── AdminPanel.jsx    # Admin dashboard panel
│
├── features/              # Feature modules (domain-driven)
│   ├── auth/             # Authentication module
│   │   ├── authSlice.js  # Redux slice for auth
│   │   ├── authService.js # Auth API calls
│   │   └── selectors.js  # Auth selectors
│   │
│   └── users/            # Users management module
│       ├── usersSlice.js # Redux slice for users
│       ├── selectors.js  # Users selectors
│       ├── api/          # API layer
│       │   └── usersApi.js
│       ├── components/   # Users-specific components
│       │   ├── detail/   # User detail view components
│       │   ├── dialogs/  # Modal dialogs for operations
│       │   ├── form/     # User forms
│       │   ├── layout/   # Layout components (toolbar, pagination, etc.)
│       │   └── list/     # User list/table components
│       ├── hooks/        # Custom hooks
│       │   ├── useUserDetail.js
│       │   ├── useUserMutations.js
│       │   └── useUsersList.js
│       ├── types/        # TypeScript-style type definitions
│       │   └── userTypes.js
│       └── utils/        # Helper functions
│           ├── userMappers.js
│           └── userStatusHelpers.js
│
├── pages/                # Route-level page components
│   ├── Home.jsx          # Landing page
│   ├── Login.jsx         # Login page
│   ├── Register.jsx      # Registration page
│   ├── Dashboard.jsx     # Dashboard layout
│   ├── Content.jsx       # Dashboard content
│   ├── NotFound.jsx      # 404 page
│   ├── PrivateRoute.jsx  # Protected route wrapper
│   └── users/            # User management pages
│       ├── UsersListPage.jsx
│       ├── UserDetailPage.jsx
│       ├── UserCreatePage.jsx
│       └── UserEditPage.jsx
│
├── hooks/                # Global custom hooks
│   ├── useTheme.js       # Theme management
│   ├── useUserFilters.js # User filtering logic
│   └── usePagination.js  # Pagination logic
│
├── contexts/             # React contexts
│   └── ThemeContext.jsx  # Theme context provider
│
├── utils/                # Utility functions
│   ├── request.js        # Axios instance with interceptors
│   └── localStorage.js   # LocalStorage helpers
│
├── constants/            # Application constants
│   └── index.js          # Global constants
│
├── App.js                # Root component with routes
├── index.js              # Application entry point
└── index.css             # Global styles
```

## Architecture Patterns

### 1. Feature-Based Organization

Features are organized by domain (auth, users) rather than by technical role. Each feature is self-contained:

```
features/users/
├── usersSlice.js      # State management
├── selectors.js       # State selectors
├── api/               # API calls
├── components/        # UI components
├── hooks/             # Business logic
├── utils/             # Helper functions
└── types/             # Type definitions
```

**Benefits:**
- Easy to locate feature-related code
- Clear boundaries between features
- Easier to add/remove features
- Better code organization

### 2. Redux Toolkit for State Management

All global state is managed through Redux Toolkit:

**Store Structure:**
```javascript
{
  auth: {
    user: Object | null,
    users: Array,
    loading: boolean,
    error: boolean,
    message: string
  },
  users: {
    users: Array,
    filters: { search, status, role },
    pagination: { page, pageSize, total, totalPages },
    currentUser: Object | null,
    isLoading: boolean,
    error: string | null,
    isLoadingDetail: boolean,
    detailError: string | null,
    isSubmitting: boolean,
    submitError: string | null
  }
}
```

**Async Operations:**
- All API calls use `createAsyncThunk`
- Automatic handling of pending/fulfilled/rejected states
- Error extraction and user feedback

### 3. Component Architecture

**Hierarchy:**
```
Page Component (Route)
  └── Layout Components
      └── Smart Components (with hooks)
          └── Presentational Components
              └── UI Components (Button, Input, etc.)
```

**Component Types:**

1. **Page Components** (`src/pages/`)
   - Route-level components
   - Connect to Redux or hooks
   - Handle navigation
   - Example: `UsersListPage.jsx`

2. **Smart Components** (`src/features/*/components/`)
   - Feature-specific components
   - Use custom hooks for logic
   - Handle local state
   - Example: `UsersTable.jsx`

3. **Presentational Components** (`src/features/*/components/`)
   - Receive data via props
   - Focus on rendering
   - Minimal logic
   - Example: `UserRow.jsx`

4. **UI Components** (`src/components/ui/`)
   - Reusable building blocks
   - No business logic
   - Styled and generic
   - Example: `Button.jsx`, `Input.jsx`

### 4. Custom Hooks Pattern

Encapsulate business logic in custom hooks:

**Example - useUserMutations:**
```javascript
export function useUserMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = useCallback(async (formValues) => {
    setIsLoading(true);
    try {
      const payload = mapCreateUserPayload(formValues);
      const response = await apiCreateUser(payload);
      toast.success('Usuario creado exitosamente');
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createUser, isLoading, error };
}
```

**Benefits:**
- Reusable logic
- Centralized error handling
- Consistent patterns
- Easier testing

### 5. API Layer Architecture

**Three-Layer Approach:**

1. **HTTP Client** (`src/utils/request.js`)
   - Axios instance with interceptors
   - Global error handling
   - Request/response logging
   - Authentication headers

2. **Service Layer** (`src/features/*/api/*.js`)
   - API function definitions
   - Request/response mapping
   - Error logging
   - Type documentation

3. **Redux Thunks** (`src/features/*/*Slice.js`)
   - State management
   - Error extraction
   - User feedback
   - State updates

**Example Flow:**
```
Component
  └── Dispatch Thunk
      └── Call Service Function
          └── HTTP Client (Axios)
              └── API Server
```

### 6. Error Handling Strategy

Multi-layered error handling (see ERROR_HANDLING.md):

1. **ErrorBoundary** - Catches React errors
2. **Axios Interceptors** - HTTP errors
3. **Redux Thunks** - State errors
4. **Service Layer** - API errors
5. **Components** - UI errors

### 7. State Management Patterns

**Local State:**
- Form values
- UI state (modals, dropdowns)
- Component-specific data

**Redux State:**
- User authentication
- Users list and details
- Global application state
- Shared data across routes

**URL State:**
- Filters (search, status, role)
- Pagination (page, pageSize)
- Current route

### 8. Routing Architecture

**Route Structure:**
```
/ - Home (public)
/login - Login (public)
/register - Register (public)
/dashboard - Dashboard (protected)
  /dashboard - Content (admin panel)
  /dashboard/users - Users list
  /dashboard/users/new - Create user
  /dashboard/users/:userId - User details
  /dashboard/users/:userId/edit - Edit user
```

**Protected Routes:**
```jsx
<Route path="/dashboard" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
}>
  {/* Nested routes */}
</Route>
```

### 9. Theme System

**Dark Mode Support:**
- Uses React Context for theme state
- CSS variables for colors
- Tailwind dark mode classes
- Persistent in localStorage

**Theme Toggle:**
- Global toggle button
- Smooth transitions
- System preference detection

## Data Flow

### User List Flow

```
1. User navigates to /dashboard/users
2. UsersListPage component mounts
3. useUsersList hook initializes
4. Reads filters/pagination from URL params
5. Calls loadUsers() function
6. Dispatches fetchUsers API call
7. API response mapped to UI model
8. Updates users array in state
9. Component re-renders with users
10. User actions dispatch mutations
11. State updates, list refreshes
```

### User Create Flow

```
1. User clicks "Create User"
2. Navigate to /dashboard/users/new
3. UserCreatePage component mounts
4. UserForm renders in create mode
5. User fills form and submits
6. Form validates input
7. If valid, calls onSubmit handler
8. useUserMutations.createUser() called
9. API request sent
10. On success:
    - Toast notification shown
    - Navigate to user detail page
11. On error:
    - Error toast shown
    - Form stays on page
```

### Authentication Flow

```
1. User submits login form
2. dispatch(login({ email, password }))
3. authSlice login thunk executes
4. authService.login() API call
5. On success:
    - User data saved to localStorage
    - User data saved to Redux state
    - Toast notification
    - Redirect to /dashboard
6. On error:
    - Error message extracted
    - Toast error notification
    - Form shows error
```

## Performance Considerations

### Code Splitting
- Route-based code splitting via React.lazy (potential)
- Feature-based chunks

### Memoization
- `useMemo` for expensive computations
- `useCallback` for stable function references
- Redux selectors for derived state

### Bundle Size
- Tree shaking with ES modules
- Production builds minified
- Current size: ~107 KB gzipped

## Security Considerations

### Authentication
- JWT-based (cookie-based)
- Credentials sent with requests
- Protected routes
- Auto-redirect on 401

### Authorization
- Role-based access control
- Admin-only features
- Server-side validation

### Data Validation
- Client-side form validation
- Server-side validation (assumed)
- Input sanitization

## Best Practices

### Component Design
✅ Single Responsibility Principle
✅ Props validation with PropTypes (or TypeScript)
✅ Meaningful component names
✅ Consistent file naming

### State Management
✅ Minimal Redux state
✅ Normalize complex state
✅ Avoid prop drilling with hooks/context
✅ Keep UI state local

### Code Quality
✅ Consistent formatting
✅ Meaningful variable names
✅ JSDoc comments for complex functions
✅ DRY (Don't Repeat Yourself)

### Error Handling
✅ Try-catch for async operations
✅ User-friendly error messages
✅ Proper error logging
✅ Graceful degradation

## Development Workflow

### Setup
```bash
npm install
```

### Development
```bash
npm run start
# Runs on http://localhost:3000
```

### Build
```bash
npm run build
# Creates optimized production build
```

### Testing
```bash
npm test
# Runs test suite
```

## Future Improvements

### Short Term
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add E2E tests
- [ ] Improve TypeScript adoption
- [ ] Add Storybook for components

### Medium Term
- [ ] Add code splitting
- [ ] Add service worker for offline support
- [ ] Add request caching
- [ ] Add optimistic updates
- [ ] Add WebSocket support

### Long Term
- [ ] Migrate to TypeScript
- [ ] Add micro-frontend architecture
- [ ] Add GraphQL layer
- [ ] Add server-side rendering
- [ ] Add progressive web app features

## References

- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [ERROR_HANDLING.md](./ERROR_HANDLING.md)
- [CLAUDE.md](./CLAUDE.md)

## Maintenance

### Adding a New Feature

1. Create feature directory in `src/features/`
2. Create Redux slice with thunks
3. Create selectors
4. Create API service functions
5. Create custom hooks
6. Create components
7. Create pages
8. Add routes to App.js
9. Update navigation
10. Add tests

### Modifying Existing Feature

1. Identify affected files
2. Update Redux slice if state changes
3. Update API functions if endpoints change
4. Update components
5. Update tests
6. Verify error handling
7. Test manually

### Debugging

1. Check browser console for errors
2. Check network tab for API errors
3. Check Redux DevTools for state
4. Check ErrorBoundary logs
5. Check axios interceptor logs
6. Add console.log strategically
7. Use React DevTools

## Contributors

Maintained by the User Control team.

For questions or issues, please refer to the repository documentation.
