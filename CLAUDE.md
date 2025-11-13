# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React-based Point of Sale (POS) Management System for stock management, order processing, and client management. Built with React 18, Redux Toolkit, React Router 6, and Tailwind CSS. Communicates with a backend API (default: http://localhost:8000).

**Required:** Node 16.19.0

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (default port 3000)
npm run start

# Build for production
npm run build

# Run tests
npm run test

# Run specific test file
npm run test -- <test-file-name>
```

## Environment Setup

Create `.env` file from `env.example`:
```
REACT_APP_API_URL=http://localhost:8000
```

If `REACT_APP_API_URL` is not set, defaults to `http://localhost:8000` (see `src/constants/index.js`).

## Architecture Overview

### State Management - Redux Toolkit

**Store Structure** (`src/app/store.js`):
- `auth`: User authentication and session
- `category`: Product categories
- `product`: Product catalog with dual search systems
- `cart`: Shopping cart with localStorage persistence
- `order`: Order lifecycle management
- `client`: Client/customer management with dual search

**Slice Pattern**: Each feature follows consistent structure:
- `<feature>Slice.js`: Redux state, reducers, async thunks
- `<feature>Service.js`: API calls using centralized axios instance
- `selectors.js`: Memoized selectors for derived state
- `adapters.js`: Data transformation between API and UI shapes
- `<feature>Hooks.js`: Custom hooks for common patterns

All async operations use `createAsyncThunk` with pending/fulfilled/rejected handling.

### API Communication

Centralized axios instance (`src/utils/request.js`):
- Base URL: `${REACT_APP_API_URL}/api`
- `withCredentials: true` for cookie-based authentication
- Default headers: `Content-Type: application/json`

### Authentication Flow

1. User data persisted to localStorage on login via `saveUser()` (`src/utils/localStorage.js`)
2. On app load, user restored from localStorage into Redux state
3. On logout, both Redux state cleared and localStorage via `removeUser()`
4. Routes protected via `PrivateRoute` wrapper component

### Local Storage Persistence

Keys defined in `src/constants/index.js`:
- `user`: Authenticated user session
- `cart`: Shopping cart items

Cart automatically synced to localStorage on every modification (add, remove, increase, decrease).

### Routing Structure (`src/App.js`)

- `/`: Public home
- `/login`, `/register`: Authentication
- `/dashboard/*`: Protected routes (requires auth):
  - `/dashboard`: Product catalog (Content)
  - `/dashboard/orders`: Order list
  - `/dashboard/orders/edit/:id`: Order editor
  - `/dashboard/client`: Client management
  - `/dashboard/form`: Add product
  - `/dashboard/category/add`: Add category
  - `/dashboard/category/:category`: Category-filtered products
  - `/dashboard/product/:id`: Product details
- `/cart`: Protected shopping cart
- `/invoice`: Protected invoice creation (CreateInvoice component)

### Dual Search Architecture Pattern

Both **products** and **clients** implement parallel search systems:

#### 1. Quick Search (Autocomplete)
- **Product**: `productQuick` thunk, 250ms debounce, ~10 results
  - State: `quickItems`, `loadingQuick`
  - Selectors: `selectQuickItems`, `selectQuickLoading`
- **Client**: `clientQuick` thunk, 300ms debounce, ~10 results
  - State: `quickItems`, `loadingQuick`
  - Hook: `useClientQuickSearch(query, { limit, debounceMs })`

#### 2. Full Search (Cursor Pagination)
- **Product**: `productSearch` thunk
  - Filters: name, category, status
  - Min 2 characters required (else `resetSearch()` clears results)
  - State: `searchItems`, `searchNextCursor`, `searchLastArgs`, `loadingSearch`
  - Pagination: Pass `cursor: nextCursor` with original args to append results
- **Client**: `clientSearch` thunk
  - Filters: name, doc, status
  - State: `items`, `nextCursor`, `loading`
  - Hook: `useClientList({ name, doc, status, pageSize })`

**Key Pattern**: Check `action.meta?.arg?.cursor` to determine if results should replace or append to existing items.

### Cart Logic (`src/features/cart/cartSlice.js`)

Cart loaded from localStorage on initialization:
- `addToCart`: Adds product or increments quantity (respects stock limit)
- `increase`/`decrease`: Modify quantity (min: 1, max: product.stock)
- `removeCartItem`: Removes item
- `clearCart`: Empties cart

Every cart modification saves to localStorage via `saveCart()`.

**Tax Calculation**: Cart slice calculates via dispatch sequence:
```javascript
dispatch(productSubTotal())  // Sum of price × quantity
dispatch(productTax())        // TAX_RATE (10.5%) of subtotal
dispatch(productTotalAmount()) // subtotal + tax
```

**Tax Rate Constant**: Defined in TWO places (keep in sync):
- `src/constants/index.js`: `TAX_RATE = 10.5`
- `src/pages/CreateInvoice.jsx`: `TAX_RATE = 0.105` (percentage form)

### Invoice/Order Creation Flow

**CreateInvoice page** (`src/pages/CreateInvoice.jsx`) - most complex component:

1. **Product Addition**:
   - Quick search autocomplete for rapid entry
   - Full product list with category filter dropdown
   - Both add products via `addToCart` → auto-saves to localStorage

2. **Client Selection**:
   - Autocomplete search via `useClientQuickSearch`
   - Custom hook `useClientSelection()` manages selected client state
   - On selection: `clientGetById` fetches full details → auto-populates contact fields (province, phone, zipcode, addresses)
   - "Fast client" modal creates new client on-the-fly without leaving page

3. **Order Submission**:
   - Builds payload via `buildOrderPayload` adapter (`src/features/client/adapters.js`)
   - Adapter merges `core` order fields + customer fields (supports legacy `customer` string + new `customerId`)
   - Dispatches `orderCreate` thunk
   - Clears cart (Redux + localStorage via `removeCart()`)
   - Redirects to `/dashboard/orders`

### Client Management Details

**Document Types** (see `src/features/client/clientHooks.js`):
- CUIT (11 digits, with checksum validation)
- DNI (7-8 digits)
- PASSPORT, OTHER

**Tax Conditions**:
- RI (Responsable Inscripto)
- MONOTRIBUTO
- CF (Consumidor Final)
- EXENTO
- NO_RESP

**Validation** (`buildClientPayload`, `validateClientPayload`):
- Frontend normalizes CUIT/DNI to digits-only
- Email validation via simple regex
- Phone canonicalization (keeps only digits and +)
- Notes truncated to 5000 chars
- CUIT checksum validation (frontend hint, backend is authority)

**Hooks**:
- `useClientQuickSearch(query, options)`: Debounced autocomplete
- `useClientList({ name, doc, status, pageSize })`: Paginated list with cursor
- `useClientSelection()`: Manages selected client for current order
- `useClientSubmitGuard()`: Prevents double-submit during save operations

### Order States (`src/features/order/orderSlice.js`)

Orders progress through lifecycle:
- `DRAFT`: Initial state on creation
- Confirm via `confirmOrder` thunk
- Cancel via `cancelOrder` thunk
- Refund via `refundOrder` thunk (partial or full)

Orders support cursor pagination via `getOrders`/`getOrdersNext` thunks.

### Component Organization

- `src/components/`: Shared presentational components (Header, Loading, ProductItem, OrderItem, etc.)
- `src/components/smart/`: Feature-specific smart components
  - `CreateInvoice/`: Subcomponents for invoice page (ProductQuickSearch, ClientAutocomplete, ItemsTable, SummaryPanel, etc.)
  - `AdminPanel/`: Admin-specific components
- `src/pages/`: Route-level page components
- `src/features/<feature>/`: Feature modules (Redux slices, services, selectors, hooks, adapters)

### Styling with Tailwind CSS

**Custom Theme** (`tailwind.config.js`):
- Colors: `brand-primary`, `brand-hover`, `brand-text`, `brand-bg`
- Fonts: `font-f1`, `font-f2`, `font-f3`, `font-f4`
- Shadows: `shadow-card`, `shadow-btn`

**Content paths**: `./src/**/*.{js,jsx,ts,tsx,html}`

Some components use CSS variable notation: `bg-[var(--bg-Color)]`

### Key Patterns and Gotchas

1. **Adapters for Data Transformation**:
   - `buildOrderPayload`: Transforms UI state → API payload
   - `buildClientPayload`: Normalizes client form → API format
   - Keeps API contracts isolated from components

2. **Cursor Pagination**:
   - To load more: pass `cursor: nextCursor` along with original search params
   - Check `hasMore` or existence of `nextCursor` before showing "Load More"
   - State determines append vs replace based on `cursor` presence in args

3. **Product Search Minimum**:
   - Requires min 2 characters
   - Query < 2 chars triggers `resetSearch()` clearing results

4. **Cart Persistence**:
   - Cart saved to localStorage on every modification
   - NOT automatically synced if localStorage changed externally
   - Cart state source of truth is Redux (initialized from localStorage on load)

5. **Client vs Customer**:
   - Terms used interchangeably in code/UI
   - Backend supports both legacy `customer` string and new `customerId` reference
   - `buildOrderPayload` includes both for backward compatibility

6. **Debouncing**:
   - Product quick search: 250ms
   - Product full search: 300ms
   - Client quick search: 300ms (configurable via hook options)
   - Use `useDebouncedValue` hook from `src/utils/common.js`

7. **Toast Notifications**:
   - All slices use `react-toastify` for user feedback
   - Success/error messages dispatched from slice `fulfilled`/`rejected` cases

8. **Stock Validation**:
   - Cart enforces stock limits on add/increase
   - Product quantity cannot exceed `product.stock`
   - Validation happens in cart reducer, not component

### Common Selectors Pattern

Selectors live in `src/features/<feature>/selectors.js`:
- Keep them simple and focused
- Memoization handled by Redux Toolkit's `createSelector` (when needed)
- Export individual selectors (not objects)
- Name pattern: `select<Feature><Property>` (e.g., `selectSearchItems`, `selectQuickLoading`)
