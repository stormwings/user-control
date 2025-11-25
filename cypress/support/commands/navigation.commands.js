/**
 * Navigation Commands
 * Custom Cypress commands for navigation and routing
 */

/**
 * Verifies current URL matches expected path
 * @param {string} path - Expected path
 * @example cy.shouldBeAt('/dashboard')
 */
Cypress.Commands.add('shouldBeAt', (path) => {
  cy.url().should('include', path);
});

/**
 * Navigates to a protected route (requires auth)
 * Sets up auth state before navigating
 * @param {string} path - Route path
 * @param {Object} userData - Optional user data, uses default admin if not provided
 * @example cy.visitProtected('/dashboard/users')
 */
Cypress.Commands.add('visitProtected', (path, userData = null) => {
  if (userData) {
    cy.setAuthState(userData);
  } else {
    // Use default admin user
    cy.fixture('users').then((users) => {
      cy.setAuthState({
        data: {
          user: users.adminUser,
          token: 'fake-token',
        },
      });
    });
  }
  cy.visit(path);
});

/**
 * Waits for page to be fully loaded
 * @example cy.waitForPageLoad()
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().its('document.readyState').should('equal', 'complete');
});
