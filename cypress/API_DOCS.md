# Auth Module

Complete authentication and user management module following the layered architecture pattern. Handles user registration, login, logout, role management, and user administration with JWT-based authentication.

## Architecture

```
api/modules/auth/
├── authSchemas.js    # Zod validation schemas
├── userModel.js      # (references api/models/userModel.js)
├── authRepo.js       # Data access layer
├── authDto.js        # Data transfer objects
├── authService.js    # Business logic layer
├── authController.js # HTTP request handlers
└── authRoutes.js     # Express route definitions
```

## Layer Responsibilities

### Schemas (`authSchemas.js`)
- **Request validation** using Zod
- **Email normalization**: Lowercase and trimmed
- **Password requirements**: Minimum 6 characters
- **Name validation**: Minimum 2 characters, trimmed
- **Query parameter validation**: Pagination, filtering, and search
- **Role validation**: Restricted to `admin`, `user`, `viewer`, `seller`
- **Status validation**: Restricted to `active`, `inactive`, `blocked`, `pending`

### Repository (`authRepo.js`)
- User data access abstraction
- Query by email or ID
- Session management support for transactions
- Pagination support with sorting
- CRUD operations on User model

### DTOs (`authDto.js`)
- **`userToDTO`**: Basic user data for login/register responses (id, name, email, isAdmin)
- **`userToFullDTO`**: Complete user data including status, role, and timestamps

### Service (`authService.js`)
- **Authentication logic**: Login, registration, password validation
- **Password hashing**: bcrypt with 8 salt rounds
- **JWT generation**: 30-day token expiration
- **User validation**: Existence checks, status verification
- **User management**: Role updates, status toggling, password resets
- **Error handling**: Proper HTTP status codes (401, 403, 404, 409, 500)

### Controller (`authController.js`)
- HTTP request/response handling
- Schema validation with Zod
- Cookie management for JWT tokens
- Service layer invocation
- Error response formatting

### Routes (`authRoutes.js`)
- **Public endpoints**: Register, login, logout, user listing
- **Protected endpoints**: Role updates, user blocking, password resets (admin only)
- Authentication middleware integration

## API Endpoints

All endpoints are prefixed with `/api/auth`

---

### POST /register

Register a new user account.

**Authentication**: Public

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation**:
- `name`: Required, string (min 2 characters, trimmed)
- `email`: Required, valid email format (normalized to lowercase)
- `password`: Required, string (min 6 characters)

**Success Response** (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false
}
```

**Error Responses**:
- **400 Bad Request**: Validation errors
  ```json
  {
    "message": "Datos inválidos",
    "errors": [
      {
        "path": ["email"],
        "message": "Invalid email"
      }
    ]
  }
  ```
- **409 Conflict**: User already exists
  ```json
  {
    "message": "User already exists"
  }
  ```
- **500 Internal Server Error**: Password hashing failure
  ```json
  {
    "message": "Error hashing password"
  }
  ```

**Example Request**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### POST /login

Authenticate a user and receive an access token via httpOnly cookie.

**Authentication**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation**:
- `email`: Required, valid email format (normalized to lowercase)
- `password`: Required, string

**Success Response** (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false
}
```

**Cookie Set**:
- **Name**: `accessToken`
- **Value**: JWT token
- **httpOnly**: `true` (prevents XSS attacks)
- **sameSite**: `"none"` (cross-site support)
- **secure**: `true` (HTTPS only)
- **maxAge**: 30 days (2,592,000,000 ms)

**Error Responses**:
- **400 Bad Request**: Validation errors
  ```json
  {
    "message": "Datos inválidos",
    "errors": [...]
  }
  ```
- **401 Unauthorized**: Invalid credentials or incorrect password
  ```json
  {
    "message": "Invalid credentials"
  }
  ```
- **403 Forbidden**: User account inactive or blocked
  ```json
  {
    "message": "User account is inactive"
  }
  ```
  ```json
  {
    "message": "User account is blocked"
  }
  ```

**Example Request**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### POST /logout

Log out the current user by clearing the authentication cookie.

**Authentication**: Public

**Request Body**: None required

**Success Response** (200 OK):
```json
{
  "message": "Logged out"
}
```

**Cookie Cleared**: `accessToken` cookie expires immediately

**Example Request**:
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

---

### GET /users

Retrieve a list of all registered users with optional filtering and pagination.

**Authentication**: Public

**Query Parameters** (all optional):
- `search` (string): Search by name or email (case-insensitive)
- `status` (string): Filter by status (`active`, `inactive`, `blocked`, `pending`)
- `role` (string): Filter by role (`admin`, `user`, `viewer`, `seller`)
- `page` (number): Page number for pagination (positive integer, starts at 1)
- `pageSize` (number): Items per page (1-100, default varies)

**Behavior**:
- If neither `page` nor `pageSize` is provided, returns all users without pagination
- If pagination params are provided, returns paginated results with metadata

**Success Response (Non-Paginated)** (201 Created):
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "role": "user",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "isAdmin": true,
    "role": "admin",
    "status": "active",
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
]
```

**Success Response (Paginated)** (200 OK):
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "isAdmin": false,
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "totalCount": 50,
    "totalPages": 5,
    "currentPage": 1,
    "pageSize": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Error Responses**:
- **400 Bad Request**: Invalid query parameters
  ```json
  {
    "message": "Datos inválidos",
    "errors": [
      {
        "path": ["page"],
        "message": "Page must be a positive integer"
      }
    ]
  }
  ```
- **500 Internal Server Error**: Database error

**Example Requests**:
```bash
# Get all users (no pagination)
curl http://localhost:8000/api/auth/users

# Get paginated users
curl "http://localhost:8000/api/auth/users?page=1&pageSize=10"

# Search for users
curl "http://localhost:8000/api/auth/users?search=john"

# Filter by role and status
curl "http://localhost:8000/api/auth/users?role=admin&status=active"

# Combined filters with pagination
curl "http://localhost:8000/api/auth/users?search=doe&role=user&page=1&pageSize=20"
```

---

### GET /users/:id

Retrieve a specific user by ID.

**Authentication**: Public

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Success Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "role": "user",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- **404 Not Found**: User not found
  ```json
  {
    "message": "User not found"
  }
  ```
- **500 Internal Server Error**: Database error

**Example Request**:
```bash
curl http://localhost:8000/api/auth/users/507f1f77bcf86cd799439011
```

---

### PATCH /users/:id/role

Update a user's role. **Requires admin authentication.**

**Authentication**: Required (Admin only)

**Headers**:
```
Cookie: accessToken=<jwt_token>
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Request Body**:
```json
{
  "role": "admin"
}
```

**Validation**:
- `role`: Required, must be one of: `admin`, `user`, `viewer`, `seller` (case-insensitive)

**Success Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": true,
  "role": "admin",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Behavior**:
- When role is set to `admin`, `isAdmin` field is automatically set to `true`
- When role is set to other values, `isAdmin` is set to `false`

**Error Responses**:
- **400 Bad Request**: Invalid role value
  ```json
  {
    "message": "Datos inválidos",
    "errors": [
      {
        "path": ["role"],
        "message": "Role must be one of: admin, user, viewer, seller"
      }
    ]
  }
  ```
- **401 Unauthorized**: Not authenticated
- **403 Forbidden**: Not an admin
- **404 Not Found**: User not found
  ```json
  {
    "message": "User not found"
  }
  ```

**Example Request**:
```bash
curl -X PATCH http://localhost:8000/api/auth/users/507f1f77bcf86cd799439011/role \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "role": "admin"
  }'
```

---

### POST /users/:id/block

Toggle or set a user's status. **Requires admin authentication.**

**Authentication**: Required (Admin only)

**Headers**:
```
Cookie: accessToken=<jwt_token>
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Request Body** (optional):
```json
{
  "status": "blocked"
}
```

**Validation**:
- `status` (optional): Must be one of: `active`, `inactive`, `blocked`, `pending` (case-insensitive)

**Behavior**:
- If `status` is provided in body, sets user status to that value
- If `status` is not provided, toggles between `active` and `inactive`

**Success Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "role": "user",
  "status": "blocked",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:45:00.000Z"
}
```

**Error Responses**:
- **400 Bad Request**: Invalid status value
  ```json
  {
    "message": "Datos inválidos",
    "errors": [
      {
        "path": ["status"],
        "message": "Status must be one of: active, inactive, blocked, pending"
      }
    ]
  }
  ```
- **401 Unauthorized**: Not authenticated
- **403 Forbidden**: Not an admin
- **404 Not Found**: User not found
  ```json
  {
    "message": "User not found"
  }
  ```

**Example Requests**:
```bash
# Set specific status
curl -X POST http://localhost:8000/api/auth/users/507f1f77bcf86cd799439011/block \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "blocked"
  }'

# Toggle status (active ↔ inactive)
curl -X POST http://localhost:8000/api/auth/users/507f1f77bcf86cd799439011/block \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{}'
```

---

### POST /users/:id/reset-password

Reset a user's password. **Requires admin authentication.**

**Authentication**: Required (Admin only)

**Headers**:
```
Cookie: accessToken=<jwt_token>
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Request Body**:
```json
{
  "password": "newPassword123"
}
```

**Validation**:
- `password`: Required, string (min 6 characters)

**Success Response** (200 OK):
```json
{
  "message": "Password reset successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "role": "user",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Security**:
- New password is hashed with bcrypt (8 salt rounds) before storage
- Original password is never exposed in responses

**Error Responses**:
- **400 Bad Request**: Password validation failed
  ```json
  {
    "message": "Datos inválidos",
    "errors": [
      {
        "path": ["password"],
        "message": "Password must be at least 6 characters"
      }
    ]
  }
  ```
- **401 Unauthorized**: Not authenticated
- **403 Forbidden**: Not an admin
- **404 Not Found**: User not found
  ```json
  {
    "message": "User not found"
  }
  ```
- **500 Internal Server Error**: Password hashing failure
  ```json
  {
    "message": "Error hashing password"
  }
  ```

**Example Request**:
```bash
curl -X POST http://localhost:8000/api/auth/users/507f1f77bcf86cd799439011/reset-password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "password": "newSecurePassword123"
  }'
```

---

## Security Features

### Password Security
- **Hashing algorithm**: bcrypt
- **Salt rounds**: 8
- **Minimum length**: 6 characters
- **Storage**: Only hashed passwords stored in database
- **Comparison**: Constant-time comparison via bcrypt.compareSync

### JWT Authentication
- **Expiration**: 30 days
- **Storage**: httpOnly cookies (prevents XSS)
- **Token generation**: Uses secure JWT library
- **Cookie settings**:
  - `httpOnly: true` - Prevents client-side JavaScript access
  - `sameSite: "none"` - Allows cross-site requests
  - `secure: true` - HTTPS only
  - `maxAge: 2592000000` - 30 days in milliseconds

### User Status Protection
- **Inactive users**: Cannot log in (403 Forbidden)
- **Blocked users**: Cannot log in (403 Forbidden)
- **Status validation**: Only valid statuses accepted

### Error Handling
Proper HTTP status codes without information leakage:
- **401 Unauthorized**: Invalid credentials (doesn't reveal if email exists)
- **403 Forbidden**: Account inactive or blocked
- **404 Not Found**: User not found
- **409 Conflict**: User already exists
- **500 Internal Server Error**: Server-side errors

### Input Validation
- **Email normalization**: Lowercase and trimmed
- **Name sanitization**: Trimmed whitespace
- **Schema validation**: All inputs validated with Zod
- **Role validation**: Restricted to allowed values
- **Status validation**: Restricted to allowed values

## Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  isAdmin: Boolean (default: false),
  role: String (enum: ["admin", "user", "viewer", "seller"]),
  status: String (enum: ["active", "inactive", "blocked", "pending"]),
  createdAt: Date,
  updatedAt: Date
}
```

### User DTO (Basic)
```javascript
{
  id: String,
  name: String,
  email: String,
  isAdmin: Boolean
}
```

### User DTO (Full)
```javascript
{
  id: String,
  name: String,
  email: String,
  isAdmin: Boolean,
  role: String,
  status: String,
  createdAt: String (ISO 8601),
  updatedAt: String (ISO 8601)
}
```

## Transaction Support

All service methods accept an optional `{ session }` parameter for MongoDB transactions:

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await authService.register(userData, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Error Codes Reference

| Code | Message | Scenario |
|------|---------|----------|
| 400 | Datos inválidos | Validation errors from Zod schemas |
| 401 | Invalid credentials | Wrong email or password |
| 403 | User account is inactive | User status is "inactive" |
| 403 | User account is blocked | User status is "blocked" |
| 404 | User not found | User ID doesn't exist |
| 409 | User already exists | Email already registered |
| 500 | Error hashing password | bcrypt failure |

## Integration Example

Complete authentication flow:

```javascript
// 1. Register a new user
const registerResponse = await fetch('http://localhost:8000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
const user = await registerResponse.json();

// 2. Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Important: Include cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});
const loggedUser = await loginResponse.json();

// 3. Access protected routes (admin only)
const updateRoleResponse = await fetch('http://localhost:8000/api/auth/users/507f.../role', {
  method: 'PATCH',
  credentials: 'include', // Sends cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'admin' })
});

// 4. Logout
await fetch('http://localhost:8000/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});
```

## Backward Compatibility

This module maintains full backward compatibility:
- Old controller at `api/controllers/authController.js` remains unchanged
- Old routes at `api/routes/authRoutes.js` remains unchanged
- Server now uses new modular routes: `require("./modules/auth/authRoutes")`
- All endpoint paths unchanged
- Cookie settings identical
- Response formats preserved

## Testing

For testing this module, see the test files:
- Unit tests: `test/unit/auth/`
- Integration tests: `test/e2e/auth/`

Example test setup:
```javascript
const { authService } = require('./authService');

describe('Auth Service', () => {
  it('should register a new user', async () => {
    const user = await authService.register({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(user.email).toBe('test@example.com');
  });
});
```
