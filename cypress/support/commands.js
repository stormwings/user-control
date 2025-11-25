/**
 * Commands Entry Point
 * This file imports all custom command modules and makes them available globally
 *
 * Commands are organized by domain in the commands/ directory:
 * - auth.commands.js: Authentication-related commands
 * - navigation.commands.js: Navigation and routing commands
 * - assertions.commands.js: Custom assertion commands
 */

// Import all command modules
import './commands/index';

// Legacy commands for backwards compatibility
// These mirror the old API but use the new structure

/**
 * @deprecated Use cy.login() from auth.commands.js instead
 * Intercepts login API call (legacy support)
 */
Cypress.Commands.add('interceptLogin', (statusCode = 200, response = null) => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:8000';

  cy.intercept('POST', `${apiUrl}/api/auth/login`, {
    statusCode,
    body: response || {
      success: true,
      data: {
        user: {
          _id: '123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'ADMIN',
          isActive: true,
        },
        token: 'fake-jwt-token',
      },
    },
  }).as('loginRequest');
});

/**
 * @deprecated Use interceptUsers from api/interceptors.js instead
 * Intercepts users list (legacy support)
 */
Cypress.Commands.add('interceptUsersList', (users = []) => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:8000';

  cy.intercept('GET', `${apiUrl}/api/admin/users*`, {
    statusCode: 200,
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
  }).as('usersListRequest');
});
