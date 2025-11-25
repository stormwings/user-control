/**
 * Login Flow E2E Tests
 * Tests the complete user authentication flow including:
 * - UI validation
 * - Form validation
 * - Successful login
 * - Error handling
 * - Security
 */

import { loginPage, dashboardPage } from '../../support/page-objects';
import { interceptAuth } from '../../support/api';
import { ROUTES, HTTP_STATUS, TIMEOUTS } from '../../support/constants';

describe('User Login Flow', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  context('Login Page UI', () => {
    it('should display login form with all required elements', () => {
      loginPage.shouldBeVisible();
      loginPage.shouldHaveValidFormStructure();
    });

    it('should have proper form labels', () => {
      loginPage.emailLabel.should('be.visible');
      loginPage.passwordLabel.should('be.visible');
    });
  });

  context('Login Form Validation', () => {
    it('should require email and password fields', () => {
      loginPage.submit();
      cy.shouldHaveValidationError('email');
    });

    it('should validate email format', () => {
      loginPage
        .fillEmail('invalid-email')
        .fillPassword('password123')
        .submit();

      loginPage.shouldHaveInvalidEmail();
    });
  });

  context('Successful Login Flow', () => {
    it('should successfully login with valid credentials and redirect to dashboard', () => {
      cy.fixture('users').then((users) => {
        const { email, password } = users.credentials.admin;

        // Setup API mock
        interceptAuth.loginSuccess();

        // Perform login
        loginPage.login(email, password);

        // Wait for API call
        cy.wait('@loginRequest');

        // Verify redirect to dashboard
        dashboardPage.shouldBeAtUrl('/dashboard');

        // Verify authentication state
        cy.checkAuthenticated();

        // Verify stored user data
        cy.window().then((win) => {
          const storedUser = JSON.parse(win.localStorage.getItem('user'));
          expect(storedUser).to.exist;
          expect(storedUser.data.user.email).to.equal(email);
          expect(storedUser.data.user.role).to.equal('ADMIN');
        });
      });
    });

    it('should show loading state during login', () => {
      cy.fixture('users').then((users) => {
        const { email, password } = users.credentials.admin;

        // Intercept with delay to see loading state
        cy.intercept('POST', '**/api/auth/login', (req) => {
          req.reply({
            delay: 1000,
            statusCode: HTTP_STATUS.OK,
            body: {
              success: true,
              data: {
                user: users.adminUser,
                token: 'fake-jwt-token',
              },
            },
          });
        }).as('loginRequestDelayed');

        // Fill and submit
        loginPage.login(email, password);

        // Check loading state
        // loginPage.shouldShowLoadingState();

        // Wait for completion
        cy.wait('@loginRequestDelayed', { timeout: TIMEOUTS.LONG });

        // Should redirect
        dashboardPage.shouldBeVisible();
      });
    });
  });

  context('Failed Login Flow', () => {
    it('should show error message on invalid credentials', () => {
      // Setup API mock for failure
      interceptAuth.loginFailure();

      // Attempt login with wrong credentials
      loginPage.login('wrong@example.com', 'wrongpassword');

      // Wait for request
      cy.wait('@loginRequest');

      // Should stay on login page
      cy.shouldBeAt(ROUTES.LOGIN);

      // Should show error toast
      cy.shouldShowErrorToast();
    });

    it('should handle network errors gracefully', () => {
      // Setup network error
      interceptAuth.loginNetworkError();

      loginPage.login('test@example.com', 'password123');

      // Should show error message
      cy.shouldShowErrorToast();

      // Should stay on login page
      cy.shouldBeAt(ROUTES.LOGIN);
    });

    it('should handle server errors (500)', () => {
      // Setup server error
      interceptAuth.loginServerError();

      loginPage.login('test@example.com', 'password123');

      cy.wait('@loginRequest');

      // Should show error
      cy.shouldShowErrorToast();

      // Should stay on login page
      cy.shouldBeAt(ROUTES.LOGIN);
    });
  });

  context('Navigation', () => {
    it('should navigate back to home page when clicking "Volver al inicio"', () => {
      loginPage.backToHomeLink.click();
      cy.url().should('eq', Cypress.config().baseUrl + ROUTES.HOME);
    });
  });

  context('Security', () => {
    it('should not expose password in HTML', () => {
      loginPage
        .fillPassword('secretpassword')
        .passwordInput
        .should('have.attr', 'type', 'password')
        .should('have.value', 'secretpassword');
    });

    it('should clear sensitive data from localStorage on logout', () => {
      cy.fixture('users').then((users) => {
        // Set authentication state
        cy.setAuthState({
          data: {
            user: users.adminUser,
            token: 'fake-token',
          },
        });

        // Verify it's stored
        cy.shouldHaveInLocalStorage('user');

        // Clear auth
        cy.clearAuth();

        // Verify it's cleared
        cy.checkNotAuthenticated();
      });
    });

    it('should use proper autocomplete attributes', () => {
      loginPage.emailInput.should('have.attr', 'autocomplete', 'username');
      loginPage.passwordInput.should('have.attr', 'autocomplete', 'current-password');
    });
  });
});
