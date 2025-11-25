/**
 * Authentication Commands
 * Custom Cypress commands for authentication-related operations
 */

/**
 * Performs login flow using the UI
 * @param {string} email - User email
 * @param {string} password - User password
 * @example cy.login('admin@test.com', 'admin123')
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

/**
 * Logs in programmatically (bypasses UI)
 * Useful for setting up test state quickly
 * @param {Object} credentials - User credentials
 * @example cy.loginByAPI({ email: 'admin@test.com', password: 'admin123' })
 */
Cypress.Commands.add('loginByAPI', (credentials) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/auth/login`,
    body: credentials,
  }).then((response) => {
    window.localStorage.setItem('user', JSON.stringify(response.body));
  });
});

/**
 * Checks if user is authenticated by verifying localStorage
 * @example cy.checkAuthenticated()
 */
Cypress.Commands.add('checkAuthenticated', () => {
  cy.window().its('localStorage').invoke('getItem', 'user').should('exist');
});

/**
 * Checks if user is NOT authenticated
 * @example cy.checkNotAuthenticated()
 */
Cypress.Commands.add('checkNotAuthenticated', () => {
  cy.window().its('localStorage').invoke('getItem', 'user').should('not.exist');
});

/**
 * Sets authentication state directly in localStorage
 * Useful for bypassing login in tests that don't test auth
 * @param {Object} userData - User data object to store
 * @example cy.setAuthState({ user: {...}, token: '...' })
 */
Cypress.Commands.add('setAuthState', (userData) => {
  cy.window().then((win) => {
    win.localStorage.setItem('user', JSON.stringify(userData));
  });
});

/**
 * Clears authentication state
 * @example cy.clearAuth()
 */
Cypress.Commands.add('clearAuth', () => {
  cy.clearLocalStorage('user');
  cy.clearCookies();
});

/**
 * Logs out via UI
 * @example cy.logout()
 */
Cypress.Commands.add('logout', () => {
  // Navigate to profile/settings or wherever logout button is
  // Click logout button
  // For now, just clear localStorage
  cy.clearAuth();
});
