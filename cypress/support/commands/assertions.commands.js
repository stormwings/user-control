/**
 * Custom Assertion Commands
 * Reusable assertion commands for common patterns
 */

/**
 * Asserts that an error toast is visible
 * @param {string} message - Optional message to check
 * @example cy.shouldShowErrorToast('Invalid credentials')
 */
Cypress.Commands.add('shouldShowErrorToast', (message = null) => {
  const toast = cy.get('.Toastify__toast--error', { timeout: 5000 });
  toast.should('be.visible');
  if (message) {
    toast.should('contain', message);
  }
});

/**
 * Asserts that a success toast is visible
 * @param {string} message - Optional message to check
 * @example cy.shouldShowSuccessToast('Login successful')
 */
Cypress.Commands.add('shouldShowSuccessToast', (message = null) => {
  const toast = cy.get('.Toastify__toast--success', { timeout: 5000 });
  toast.should('be.visible');
  if (message) {
    toast.should('contain', message);
  }
});

/**
 * Asserts that a form field has validation error
 * @param {string} fieldName - Name attribute of the field
 * @example cy.shouldHaveValidationError('email')
 */
Cypress.Commands.add('shouldHaveValidationError', (fieldName) => {
  cy.get(`input[name="${fieldName}"]:invalid`).should('exist');
});

/**
 * Asserts that localStorage contains specific key and value
 * @param {string} key - localStorage key
 * @param {string} expectedValue - Expected value (optional)
 * @example cy.shouldHaveInLocalStorage('user')
 */
Cypress.Commands.add('shouldHaveInLocalStorage', (key, expectedValue = null) => {
  cy.window()
    .its('localStorage')
    .invoke('getItem', key)
    .should('exist')
    .then((value) => {
      if (expectedValue) {
        expect(value).to.equal(expectedValue);
      }
    });
});

/**
 * Asserts that loading state is visible
 * @param {string} selector - Selector for loading element
 * @example cy.shouldBeLoading('button[type="submit"]')
 */
Cypress.Commands.add('shouldBeLoading', (selector = '[data-testid="loading"]') => {
  cy.get(selector).should('exist');
});
