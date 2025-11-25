/**
 * Cypress Selectors Utility
 * Helper functions to get data-cy selectors from constants
 *
 * This utility synchronizes with src/constants/testIds.js
 * to ensure consistency between React components and Cypress tests
 */

// Import from source constants (update path if needed)
// For now, we define them here to avoid build issues
// In a real setup, you'd import from a shared constants file

/**
 * Gets a data-cy selector string
 * @param {string} testId - The test ID constant
 * @returns {string} The data-cy selector
 * @example
 * cy.get(dataCy('login-email-input'))
 */
export const dataCy = (testId) => `[data-cy="${testId}"]`;

/**
 * Gets a data-cy selector with an index
 * @param {string} testId - The test ID constant
 * @param {number} index - The index to append
 * @returns {string} The data-cy selector with index
 * @example
 * cy.get(dataCyIndex('user-list-item', 0))
 */
export const dataCyIndex = (testId, index) => `[data-cy="${testId}-${index}"]`;

/**
 * Gets a data-cy selector with a dynamic value
 * @param {string} testId - The test ID constant
 * @param {string} value - The value to append
 * @returns {string} The data-cy selector with value
 * @example
 * cy.get(dataCyValue('user-list-item', userId))
 */
export const dataCyValue = (testId, value) => `[data-cy="${testId}-${value}"]`;

/**
 * Gets a data-cy selector with a state
 * @param {string} testId - The test ID constant
 * @param {string} state - The state to append (e.g., 'active', 'disabled')
 * @returns {string} The data-cy selector with state
 * @example
 * cy.get(dataCyState('button', 'loading'))
 */
export const dataCyState = (testId, state) => `[data-cy="${testId}-${state}"]`;

/**
 * Test ID constants
 * Mirrors src/constants/testIds.js for use in Cypress tests
 */
export const TEST_IDS = {
  // Auth
  AUTH: {
    LOGIN_PAGE: 'login-page',
    LOGIN_FORM: 'login-form',
    LOGIN_EMAIL_INPUT: 'login-email-input',
    LOGIN_PASSWORD_INPUT: 'login-password-input',
    LOGIN_SUBMIT_BUTTON: 'login-submit-button',
    LOGIN_BACK_HOME_LINK: 'login-back-home-link',
  },

  // Layout
  LAYOUT: {
    SIDEBAR: 'sidebar',
    SIDEBAR_NAV: 'sidebar-nav',
    SIDEBAR_USER_MENU: 'sidebar-user-menu',
    SIDEBAR_LOGOUT_BUTTON: 'sidebar-logout-button',
    DASHBOARD_CONTAINER: 'dashboard-container',
    DASHBOARD_MAIN_CONTENT: 'dashboard-main-content',
  },

  // Navigation
  NAV: {
    NAV_DASHBOARD: 'nav-dashboard',
    NAV_USERS: 'nav-users',
  },

  // Users
  USERS: {
    USERS_PAGE: 'users-page',
    USERS_TABLE: 'users-table',
    USERS_SEARCH: 'users-search',
    USERS_CREATE_BUTTON: 'users-create-button',
    USER_FORM: 'user-form',
    USER_FORM_SUBMIT_BUTTON: 'user-form-submit-button',
  },

  // UI
  UI: {
    BUTTON: 'button',
    INPUT: 'input',
    CARD: 'card',
    CHIP: 'chip',
  },
};

/**
 * Helper to get by data-cy attribute using Cypress
 * @param {string} value - The data-cy value
 * @returns {Cypress.Chainable} Cypress chainable element
 * @example
 * getByCy('login-submit-button').click()
 */
export const getByCy = (value) => cy.get(dataCy(value));

/**
 * Helper to find by data-cy attribute using Cypress
 * @param {string} value - The data-cy value
 * @returns {Cypress.Chainable} Cypress chainable element
 * @example
 * cy.get('.container').findByCy('nested-element')
 */
export const findByCy = (value) => cy.find(dataCy(value));

// Add as global Cypress commands
if (typeof Cypress !== 'undefined') {
  Cypress.Commands.add('getByCy', getByCy);
  Cypress.Commands.add('findByCy', { prevSubject: 'element' }, (subject, value) => {
    return cy.wrap(subject).find(dataCy(value));
  });
}
