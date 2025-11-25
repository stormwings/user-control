/**
 * Test IDs (data-cy attributes) for E2E testing
 * Centralized constants to maintain consistency and enable easy refactoring
 *
 * Naming Convention:
 * - Use descriptive, semantic names
 * - Format: [context]-[element]-[action/state] (e.g., 'login-form-submit')
 * - Use kebab-case for all IDs
 * - Group by feature/domain
 *
 * Benefits:
 * - Single source of truth
 * - Type-safe with IDE autocomplete
 * - Easy refactoring (change once, update everywhere)
 * - Self-documenting code
 */

// =============================================================================
// AUTHENTICATION
// =============================================================================

export const AUTH_TEST_IDS = {
  // Login Page
  LOGIN_PAGE: 'login-page',
  LOGIN_FORM: 'login-form',
  LOGIN_EMAIL_INPUT: 'login-email-input',
  LOGIN_PASSWORD_INPUT: 'login-password-input',
  LOGIN_SUBMIT_BUTTON: 'login-submit-button',
  LOGIN_BACK_HOME_LINK: 'login-back-home-link',
  LOGIN_ERROR_MESSAGE: 'login-error-message',

  // Register Page
  REGISTER_PAGE: 'register-page',
  REGISTER_FORM: 'register-form',
  REGISTER_NAME_INPUT: 'register-name-input',
  REGISTER_EMAIL_INPUT: 'register-email-input',
  REGISTER_PASSWORD_INPUT: 'register-password-input',
  REGISTER_SUBMIT_BUTTON: 'register-submit-button',
  REGISTER_BACK_HOME_LINK: 'register-back-home-link',
};

// =============================================================================
// LAYOUT
// =============================================================================

export const LAYOUT_TEST_IDS = {
  // Sidebar
  SIDEBAR: 'sidebar',
  SIDEBAR_LOGO: 'sidebar-logo',
  SIDEBAR_NAV: 'sidebar-nav',
  SIDEBAR_NAV_ITEM: 'sidebar-nav-item', // Use with index: sidebar-nav-item-0
  SIDEBAR_THEME_TOGGLE: 'sidebar-theme-toggle',
  SIDEBAR_USER_MENU: 'sidebar-user-menu',
  SIDEBAR_LOGOUT_BUTTON: 'sidebar-logout-button',

  // Dashboard
  DASHBOARD_CONTAINER: 'dashboard-container',
  DASHBOARD_HEADER: 'dashboard-header',
  DASHBOARD_MAIN_CONTENT: 'dashboard-main-content',
  DASHBOARD_FOOTER: 'dashboard-footer',
};

// =============================================================================
// UI COMPONENTS
// =============================================================================

export const UI_TEST_IDS = {
  // Button
  BUTTON: 'button',
  BUTTON_PRIMARY: 'button-primary',
  BUTTON_SECONDARY: 'button-secondary',
  BUTTON_GHOST: 'button-ghost',
  BUTTON_LOADING: 'button-loading',

  // Input
  INPUT: 'input',
  INPUT_ERROR: 'input-error',
  INPUT_LABEL: 'input-label',

  // Card
  CARD: 'card',
  CARD_HEADER: 'card-header',
  CARD_BODY: 'card-body',
  CARD_FOOTER: 'card-footer',

  // Chip/Badge
  CHIP: 'chip',
  CHIP_STATUS: 'chip-status',

  // Theme Toggle
  THEME_TOGGLE_BUTTON: 'theme-toggle-button',
};

// =============================================================================
// ADMIN PANEL
// =============================================================================

export const ADMIN_TEST_IDS = {
  // Admin Panel Container
  ADMIN_PANEL: 'admin-panel',
  ADMIN_PANEL_HEADER: 'admin-panel-header',
  ADMIN_PANEL_TITLE: 'admin-panel-title',

  // Quick Actions
  QUICK_ACTIONS_CONTAINER: 'quick-actions-container',
  QUICK_ACTION: 'quick-action', // Use with index: quick-action-0

  // Filters
  FILTERS_CONTAINER: 'filters-container',
  FILTER_BUTTON: 'filter-button', // Use with suffix: filter-button-active
  SEARCH_INPUT: 'search-input',

  // User List
  USER_LIST: 'user-list',
  USER_LIST_ITEM: 'user-list-item', // Use with user ID: user-list-item-{userId}
  USER_LIST_EMPTY: 'user-list-empty',
  USER_LIST_LOADING: 'user-list-loading',

  // User Actions
  USER_ACTIONS_MENU: 'user-actions-menu',
  USER_EDIT_BUTTON: 'user-edit-button',
  USER_DELETE_BUTTON: 'user-delete-button',
  USER_BLOCK_BUTTON: 'user-block-button',
  USER_ACTIVATE_BUTTON: 'user-activate-button',

  // Pagination
  PAGINATION: 'pagination',
  PAGINATION_PREV: 'pagination-prev',
  PAGINATION_NEXT: 'pagination-next',
  PAGINATION_PAGE: 'pagination-page', // Use with page number: pagination-page-1
  PAGINATION_INFO: 'pagination-info',
};

// =============================================================================
// USERS MODULE
// =============================================================================

export const USERS_TEST_IDS = {
  // Users List Page
  USERS_PAGE: 'users-page',
  USERS_PAGE_HEADER: 'users-page-header',
  USERS_PAGE_TITLE: 'users-page-title',
  USERS_CREATE_BUTTON: 'users-create-button',

  // Users Table
  USERS_TABLE: 'users-table',
  USERS_TABLE_HEAD: 'users-table-head',
  USERS_TABLE_BODY: 'users-table-body',
  USERS_TABLE_ROW: 'users-table-row', // Use with user ID: users-table-row-{userId}
  USERS_TABLE_EMPTY: 'users-table-empty',

  // Users Filters
  USERS_SEARCH: 'users-search',
  USERS_FILTER_STATUS: 'users-filter-status',
  USERS_FILTER_ROLE: 'users-filter-role',
  USERS_FILTER_CLEAR: 'users-filter-clear',

  // User Detail Page
  USER_DETAIL_PAGE: 'user-detail-page',
  USER_DETAIL_CARD: 'user-detail-card',
  USER_DETAIL_NAME: 'user-detail-name',
  USER_DETAIL_EMAIL: 'user-detail-email',
  USER_DETAIL_ROLE: 'user-detail-role',
  USER_DETAIL_STATUS: 'user-detail-status',
  USER_DETAIL_EDIT_BUTTON: 'user-detail-edit-button',
  USER_DETAIL_DELETE_BUTTON: 'user-detail-delete-button',
  USER_DETAIL_BACK_BUTTON: 'user-detail-back-button',

  // User Form (Create/Edit)
  USER_FORM: 'user-form',
  USER_FORM_NAME_INPUT: 'user-form-name-input',
  USER_FORM_EMAIL_INPUT: 'user-form-email-input',
  USER_FORM_PASSWORD_INPUT: 'user-form-password-input',
  USER_FORM_ROLE_SELECT: 'user-form-role-select',
  USER_FORM_STATUS_SELECT: 'user-form-status-select',
  USER_FORM_SUBMIT_BUTTON: 'user-form-submit-button',
  USER_FORM_CANCEL_BUTTON: 'user-form-cancel-button',

  // User Dialogs
  USER_DELETE_DIALOG: 'user-delete-dialog',
  USER_DELETE_CONFIRM_BUTTON: 'user-delete-confirm-button',
  USER_DELETE_CANCEL_BUTTON: 'user-delete-cancel-button',
  USER_CHANGE_ROLE_DIALOG: 'user-change-role-dialog',
  USER_BLOCK_DIALOG: 'user-block-dialog',
};

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAV_TEST_IDS = {
  NAV_HOME: 'nav-home',
  NAV_DASHBOARD: 'nav-dashboard',
  NAV_USERS: 'nav-users',
  NAV_PRODUCTS: 'nav-products',
  NAV_SALES: 'nav-sales',
  NAV_REPORTS: 'nav-reports',
  NAV_SETTINGS: 'nav-settings',
};

// =============================================================================
// FORMS
// =============================================================================

export const FORM_TEST_IDS = {
  FORM: 'form',
  FORM_ERROR: 'form-error',
  FORM_SUCCESS: 'form-success',
  FORM_LOADING: 'form-loading',
  FORM_FIELD: 'form-field', // Use with field name: form-field-email
  FORM_FIELD_ERROR: 'form-field-error',
};

// =============================================================================
// COMMON ELEMENTS
// =============================================================================

export const COMMON_TEST_IDS = {
  LOADING_SPINNER: 'loading-spinner',
  ERROR_MESSAGE: 'error-message',
  SUCCESS_MESSAGE: 'success-message',
  EMPTY_STATE: 'empty-state',
  MODAL: 'modal',
  MODAL_CLOSE: 'modal-close',
  TOAST: 'toast',
  TOAST_ERROR: 'toast-error',
  TOAST_SUCCESS: 'toast-success',
  DROPDOWN: 'dropdown',
  DROPDOWN_TRIGGER: 'dropdown-trigger',
  DROPDOWN_MENU: 'dropdown-menu',
  DROPDOWN_ITEM: 'dropdown-item',
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Creates a test ID with an index suffix
 * @param {string} baseId - Base test ID
 * @param {number} index - Index to append
 * @returns {string} Test ID with index (e.g., 'user-list-item-0')
 */
export const withIndex = (baseId, index) => `${baseId}-${index}`;

/**
 * Creates a test ID with a dynamic value
 * @param {string} baseId - Base test ID
 * @param {string} value - Value to append
 * @returns {string} Test ID with value (e.g., 'user-list-item-abc123')
 */
export const withValue = (baseId, value) => `${baseId}-${value}`;

/**
 * Creates a test ID with a state suffix
 * @param {string} baseId - Base test ID
 * @param {string} state - State to append (e.g., 'active', 'disabled')
 * @returns {string} Test ID with state (e.g., 'button-active')
 */
export const withState = (baseId, state) => `${baseId}-${state}`;

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  AUTH: AUTH_TEST_IDS,
  LAYOUT: LAYOUT_TEST_IDS,
  UI: UI_TEST_IDS,
  ADMIN: ADMIN_TEST_IDS,
  USERS: USERS_TEST_IDS,
  NAV: NAV_TEST_IDS,
  FORM: FORM_TEST_IDS,
  COMMON: COMMON_TEST_IDS,
  // Utility functions
  withIndex,
  withValue,
  withState,
};
