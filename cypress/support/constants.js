/**
 * Global Constants
 * Centralized constants used across tests
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    USERS: '/api/auth/users',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    USER_DETAIL: (id) => `/api/admin/users/${id}`,
    USER_ROLE: (id) => `/api/admin/users/${id}/role`,
    USER_BLOCK: (id) => `/api/admin/users/${id}/block`,
    USER_UNBLOCK: (id) => `/api/admin/users/${id}/unblock`,
    USER_ACTIVATE: (id) => `/api/admin/users/${id}/activate`,
    USER_DEACTIVATE: (id) => `/api/admin/users/${id}/deactivate`,
    USER_RESET_PASSWORD: (id) => `/api/admin/users/${id}/reset-password`,
    USER_AUDIT: (id) => `/api/admin/users/${id}/audit`,
  },
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  USERS: '/dashboard/users',
  USER_DETAIL: (id) => `/dashboard/users/${id}`,
  USER_EDIT: (id) => `/dashboard/users/${id}/edit`,
  USER_CREATE: '/dashboard/users/new',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  VIEWER: 'VIEWER',
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING: 'PENDING',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  CART: 'cart',
  THEME: 'user-control-theme',
};

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 10000,
  API_CALL: 10000,
};

// Test Data
export const TEST_DATA = {
  VALID_EMAIL: 'test@example.com',
  INVALID_EMAIL: 'invalid-email',
  VALID_PASSWORD: 'password123',
  SHORT_PASSWORD: '123',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Toast CSS Classes
export const TOAST_SELECTORS = {
  ERROR: '.Toastify__toast--error',
  SUCCESS: '.Toastify__toast--success',
  INFO: '.Toastify__toast--info',
  WARNING: '.Toastify__toast--warning',
};
