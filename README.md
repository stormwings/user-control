# User Control

React application for user authentication and user management with role-based access control.

## Tech Stack

- React 18, Redux Toolkit, React Router v6
- Tailwind CSS (dark mode support)
- Cypress for E2E testing
- Axios for API requests

## Requirements

- Node.js 16.19.0
- Backend API at `http://localhost:8000`

## Setup

```bash
npm install
cp env.example .env
npm start
```

## Scripts

```bash
npm start              # Dev server (port 3000)
npm run build         # Production build
npm test              # Unit tests
npm run cypress:open  # E2E tests (interactive)
npm run e2e          # E2E tests (headless + auto-start server)
```

## Project Structure

```
src/
├── app/              # Redux store
├── components/       # React components
│   ├── ui/          # Atomic components (Button, Input, Card)
│   ├── layout/      # Layout (Sidebar, Dashboard)
│   ├── users/       # User management components
│   └── common/      # Shared components
├── constants/       # Constants (including testIds for E2E)
├── contexts/        # React contexts (Theme)
├── features/        # Redux slices
│   └── auth/       # Authentication
├── hooks/           # Custom hooks
├── pages/           # Page components
└── utils/           # Utilities

cypress/
├── e2e/             # Test specs
├── fixtures/        # Test data
└── support/         # Commands, page objects, helpers
```

## Features

### Authentication
- Login / Register
- JWT-based authentication
- Protected routes
- Persistent sessions (localStorage)

### User Management
- List users (search, filter, pagination)
- Create / Edit / Delete users
- Role management (Admin, Seller, Viewer)
- Account status (Active, Inactive, Blocked)
- Password reset
- Audit log

### UI
- Dark mode with system preference detection
- Responsive design
- Toast notifications
- Loading states
- Error boundaries

## Architecture

### State Management
Redux Toolkit with feature-based slices:
- `auth/authSlice.js` - Authentication state
- Async thunks for API calls
- localStorage persistence

### Routing
- Public: `/`, `/login`, `/register`
- Protected: `/dashboard`, `/dashboard/users/*`
- `PrivateRoute` component for auth check

### API
- Axios instance: `src/utils/request.js`
- Base URL: `${REACT_APP_API_URL}/api`
- Credentials: `withCredentials: true`

### Component Pattern
Atomic design:
- **Atoms**: Button, Input, Card, Chip
- **Molecules**: FilterButton, Pagination
- **Organisms**: UsersTable, UserForm
- **Pages**: Login, Dashboard, UsersListPage

All atoms accept `dataCy` prop for E2E testing.

### Theme
- Context: `src/contexts/ThemeContext.jsx`
- Hook: `useTheme()`
- Tailwind's `darkMode: 'class'` strategy
- Persisted to localStorage

## Environment

```bash
REACT_APP_API_URL=http://localhost:8000
```

## Testing

Unit tests: `npm test`

E2E tests: See [TESTING.md](./TESTING.md)

**Test coverage:**
- ✅ Login flow (UI, validation, success, errors)
- ✅ Form validation
- ✅ API error handling
- 🔄 User management (in progress)

## Development

### Adding Features

1. Create Redux slice (if state needed): `src/features/feature/`
2. Create components: Follow atomic design
3. Add routes: Update `src/App.js`
4. Add `data-cy` attributes: Define in `src/constants/testIds.js`
5. Write E2E tests: Create page object + test spec

### Code Style

- Components: PascalCase
- Utilities: camelCase
- Constants: SCREAMING_SNAKE_CASE
- CSS: Tailwind utility classes

## Documentation

- [TESTING.md](./TESTING.md) - Complete E2E testing guide

## License

MIT
