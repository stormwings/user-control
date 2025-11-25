/**
 * API Interceptors
 * Centralized API mocking utilities
 * Provides consistent way to mock API responses across tests
 */

import { API_ENDPOINTS, HTTP_STATUS } from '../constants';

/**
 * Gets the full API URL for an endpoint
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full API URL
 */
const getApiUrl = (endpoint) => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:8000';
  return `${apiUrl}${endpoint}`;
};

/**
 * Creates a wildcard pattern for API endpoints
 * @param {string} endpoint - API endpoint path
 * @returns {string} Wildcard pattern
 */
const wildcardEndpoint = (endpoint) => `**${endpoint}`;

/**
 * Authentication API Interceptors
 */
export const interceptAuth = {
  /**
   * Intercepts login API call
   * @param {Object} options - Interceptor options
   * @param {number} options.statusCode - HTTP status code (default: 200)
   * @param {Object} options.response - Response body (optional, uses fixture if not provided)
   * @param {number} options.delay - Response delay in ms (optional)
   * @param {string} options.alias - Cypress alias (default: 'loginRequest')
   */
  login: ({ statusCode = HTTP_STATUS.OK, response = null, delay = 0, alias = 'loginRequest' } = {}) => {
    const interceptConfig = {
      statusCode,
      body: response,
    };

    if (delay > 0) {
      interceptConfig.delay = delay;
    }

    if (response) {
      cy.intercept('POST', wildcardEndpoint(API_ENDPOINTS.AUTH.LOGIN), interceptConfig).as(alias);
    } else {
      // Use fixture by default
      cy.intercept('POST', wildcardEndpoint(API_ENDPOINTS.AUTH.LOGIN), {
        statusCode,
        fixture: 'api-responses/auth.json',
        delay,
      }).as(alias);
    }
  },

  /**
   * Intercepts successful login
   * @param {Object} userData - User data (optional, uses fixture if not provided)
   * @param {string} alias - Cypress alias
   */
  loginSuccess: (userData = null, alias = 'loginRequest') => {
    if (userData) {
      interceptAuth.login({
        statusCode: HTTP_STATUS.OK,
        response: {
          success: true,
          data: userData,
        },
        alias,
      });
    } else {
      cy.fixture('api-responses/auth.json').then((auth) => {
        interceptAuth.login({
          statusCode: HTTP_STATUS.OK,
          response: auth.loginSuccess,
          alias,
        });
      });
    }
  },

  /**
   * Intercepts failed login (401)
   * @param {string} message - Error message
   * @param {string} alias - Cypress alias
   */
  loginFailure: (message = 'Credenciales inválidas', alias = 'loginRequest') => {
    interceptAuth.login({
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      response: {
        success: false,
        message,
      },
      alias,
    });
  },

  /**
   * Intercepts server error (500)
   * @param {string} alias - Cypress alias
   */
  loginServerError: (alias = 'loginRequest') => {
    cy.fixture('api-responses/auth.json').then((auth) => {
      interceptAuth.login({
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        response: auth.loginServerError,
        alias,
      });
    });
  },

  /**
   * Intercepts network error
   * @param {string} alias - Cypress alias
   */
  loginNetworkError: (alias = 'loginRequest') => {
    cy.intercept('POST', wildcardEndpoint(API_ENDPOINTS.AUTH.LOGIN), {
      forceNetworkError: true,
    }).as(alias);
  },

  /**
   * Intercepts logout API call
   * @param {number} statusCode - HTTP status code
   * @param {string} alias - Cypress alias
   */
  logout: (statusCode = HTTP_STATUS.OK, alias = 'logoutRequest') => {
    cy.intercept('POST', wildcardEndpoint(API_ENDPOINTS.AUTH.LOGOUT), {
      statusCode,
      body: { success: true, message: 'Logout successful' },
    }).as(alias);
  },

  /**
   * Intercepts register API call
   * @param {number} statusCode - HTTP status code
   * @param {Object} response - Response body
   * @param {string} alias - Cypress alias
   */
  register: (statusCode = HTTP_STATUS.CREATED, response = null, alias = 'registerRequest') => {
    cy.intercept('POST', wildcardEndpoint(API_ENDPOINTS.AUTH.REGISTER), {
      statusCode,
      body: response,
    }).as(alias);
  },
};

/**
 * Users API Interceptors
 */
export const interceptUsers = {
  /**
   * Intercepts users list API call
   * @param {Array} users - Array of user objects (optional, uses fixture if not provided)
   * @param {string} alias - Cypress alias
   */
  list: (users = null, alias = 'usersListRequest') => {
    if (users) {
      cy.intercept('GET', wildcardEndpoint(API_ENDPOINTS.ADMIN.USERS), {
        statusCode: HTTP_STATUS.OK,
        body: {
          success: true,
          data: users,
          pagination: {
            page: 1,
            limit: 10,
            total: users.length,
            totalPages: 1,
          },
        },
      }).as(alias);
    } else {
      cy.intercept('GET', wildcardEndpoint(API_ENDPOINTS.ADMIN.USERS), {
        statusCode: HTTP_STATUS.OK,
        fixture: 'api-responses/users.json',
      }).as(alias);
    }
  },

  /**
   * Intercepts user detail API call
   * @param {string} userId - User ID
   * @param {Object} userData - User data (optional)
   * @param {string} alias - Cypress alias
   */
  detail: (userId, userData = null, alias = 'userDetailRequest') => {
    const endpoint = API_ENDPOINTS.ADMIN.USER_DETAIL(userId);

    if (userData) {
      cy.intercept('GET', wildcardEndpoint(endpoint), {
        statusCode: HTTP_STATUS.OK,
        body: {
          success: true,
          data: userData,
        },
      }).as(alias);
    } else {
      cy.intercept('GET', wildcardEndpoint(endpoint), {
        statusCode: HTTP_STATUS.OK,
        fixture: 'api-responses/users.json',
      }).as(alias);
    }
  },

  /**
   * Intercepts user creation API call
   * @param {number} statusCode - HTTP status code
   * @param {Object} response - Response body
   * @param {string} alias - Cypress alias
   */
  create: (statusCode = HTTP_STATUS.CREATED, response = null, alias = 'createUserRequest') => {
    cy.intercept('POST', wildcardEndpoint(API_ENDPOINTS.ADMIN.USERS), {
      statusCode,
      body: response || { success: true, data: { _id: 'new-user-id' } },
    }).as(alias);
  },

  /**
   * Intercepts user update API call
   * @param {string} userId - User ID
   * @param {number} statusCode - HTTP status code
   * @param {string} alias - Cypress alias
   */
  update: (userId, statusCode = HTTP_STATUS.OK, alias = 'updateUserRequest') => {
    const endpoint = API_ENDPOINTS.ADMIN.USER_DETAIL(userId);
    cy.intercept('PUT', wildcardEndpoint(endpoint), {
      statusCode,
      body: { success: true, message: 'User updated successfully' },
    }).as(alias);
  },

  /**
   * Intercepts user deletion API call
   * @param {string} userId - User ID
   * @param {number} statusCode - HTTP status code
   * @param {string} alias - Cypress alias
   */
  delete: (userId, statusCode = HTTP_STATUS.OK, alias = 'deleteUserRequest') => {
    const endpoint = API_ENDPOINTS.ADMIN.USER_DETAIL(userId);
    cy.intercept('DELETE', wildcardEndpoint(endpoint), {
      statusCode,
      body: { success: true, message: 'User deleted successfully' },
    }).as(alias);
  },
};

/**
 * Generic interceptor for any API call
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Interceptor options
 */
export const interceptAPI = (method, endpoint, options = {}) => {
  const {
    statusCode = HTTP_STATUS.OK,
    response = null,
    delay = 0,
    alias = 'apiRequest',
    fixture = null,
  } = options;

  const interceptConfig = {
    statusCode,
  };

  if (response) {
    interceptConfig.body = response;
  } else if (fixture) {
    interceptConfig.fixture = fixture;
  }

  if (delay > 0) {
    interceptConfig.delay = delay;
  }

  cy.intercept(method, wildcardEndpoint(endpoint), interceptConfig).as(alias);
};
