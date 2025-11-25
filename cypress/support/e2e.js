/**
 * E2E Support File
 * Main entry point for Cypress E2E tests
 * Imports all commands, configurations, and global hooks
 */

// Import custom commands (organized by domain)
import './commands';

// Import selector utilities and helpers
import './utils/selectors';

// Import Testing Library commands for better DOM queries
import '@testing-library/cypress/add-commands';

// Prevent Cypress from failing on uncaught exceptions
// This is useful for third-party scripts that throw errors
// but don't affect the test execution
Cypress.on('uncaught:exception', (err, runnable) => {
  // You can log the error for debugging
  // console.log('Uncaught exception:', err.message);

  // Return false to prevent test failure
  return false;
});

// Global before hook to ensure clean state
beforeEach(() => {
  // Clear localStorage before each test
  cy.clearLocalStorage();

  // Clear all cookies
  cy.clearCookies();

  // Preserve specific items if needed (uncomment and customize)
  // cy.clearLocalStorage({ except: ['theme'] });
});

// Global after hook for cleanup (optional)
// afterEach(() => {
//   // Additional cleanup if needed
// });
