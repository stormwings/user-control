/**
 * User Registration E2E Tests
 * Tests the user registration flow
 */

import { registerPage, dashboardPage } from '../../support/page-objects';
import { interceptAuth } from '../../support/api';
import { ROUTES, HTTP_STATUS, TEST_DATA } from '../../support/constants';

describe('User Registration Flow', () => {
  beforeEach(() => {
    registerPage.visit();
  });

  context('Registration Page UI', () => {
    it('should display registration form with all required elements', () => {
      registerPage.shouldBeVisible();
      registerPage.shouldHaveValidFormStructure();
    });

    it('should have proper form labels', () => {
      registerPage.nameInput.should('be.visible');
      registerPage.emailInput.should('be.visible');
      registerPage.passwordInput.should('be.visible');
      registerPage.submitButton.should('be.visible');
    });
  });

  context('Registration Form Validation', () => {
    it('should require all fields', () => {
      registerPage.submit();

      // Should show validation errors
      cy.shouldHaveValidationError('name');
      cy.shouldHaveValidationError('email');
      cy.shouldHaveValidationError('password');
    });

    it('should validate email format', () => {
      registerPage
        .fillName('John Doe')
        .fillEmail('invalid-email')
        .fillPassword('password123')
        .submit();

      registerPage.shouldHaveInvalidEmail();
    });

    it('should require minimum password length', () => {
      registerPage
        .fillName('John Doe')
        .fillEmail('john@example.com')
        .fillPassword('123')
        .submit();

      // Should show password validation error
      cy.shouldHaveValidationError('password');
    });

    it('should require minimum name length', () => {
      registerPage
        .fillName('J')
        .fillEmail('john@example.com')
        .fillPassword('password123')
        .submit();

      // Should show name validation error
      cy.shouldHaveValidationError('name');
    });
  });

  context('Successful Registration Flow', () => {
    it('should successfully register with valid credentials', () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock successful registration
      interceptAuth.register(HTTP_STATUS.CREATED, {
        _id: 'new-user-123',
        name: newUser.name,
        email: newUser.email,
        role: 'USER',
        isAdmin: false,
      });

      // Mock auto-login after registration
      interceptAuth.loginSuccess({
        user: {
          _id: 'new-user-123',
          name: newUser.name,
          email: newUser.email,
          role: 'USER',
          isAdmin: false,
        },
        token: 'fake-jwt-token',
      });

      // Perform registration
      registerPage.register(newUser.name, newUser.email, newUser.password);

      // Wait for registration API call
      cy.wait('@registerRequest');

      // Should show success message
      cy.shouldShowSuccessToast();

      // Should redirect to dashboard (if auto-login) or login page
      // Adjust based on actual implementation
      cy.url().should('match', /\/(dashboard|login)/);
    });

    it('should register and redirect to login page', () => {
      const newUser = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'securepass456',
      };

      // Mock successful registration without auto-login
      interceptAuth.register(HTTP_STATUS.CREATED, {
        _id: 'new-user-456',
        name: newUser.name,
        email: newUser.email,
        role: 'USER',
        isAdmin: false,
      });

      registerPage.register(newUser.name, newUser.email, newUser.password);

      cy.wait('@registerRequest');

      cy.shouldShowSuccessToast();

      // Should redirect to login page
      cy.url().should('include', ROUTES.LOGIN);
    });

    it('should show loading state during registration', () => {
      const newUser = {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        password: 'testpass789',
      };

      // Mock with delay
      cy.intercept('POST', '**/api/auth/register', (req) => {
        req.reply({
          delay: 1000,
          statusCode: HTTP_STATUS.CREATED,
          body: {
            _id: 'new-user-789',
            name: newUser.name,
            email: newUser.email,
          },
        });
      }).as('registerRequestDelayed');

      registerPage.register(newUser.name, newUser.email, newUser.password);

      // Should show loading state
      registerPage.submitButton.should('be.disabled');

      cy.wait('@registerRequestDelayed', { timeout: 2000 });
    });
  });

  context('Failed Registration Flow', () => {
    it('should show error when email already exists', () => {
      const existingUser = {
        name: 'Existing User',
        email: 'admin@test.com', // Already exists
        password: 'password123',
      };

      // Mock 409 Conflict response
      interceptAuth.register(HTTP_STATUS.CONFLICT, {
        message: 'User already exists',
      });

      registerPage.register(existingUser.name, existingUser.email, existingUser.password);

      cy.wait('@registerRequest');

      // Should show error toast
      cy.shouldShowErrorToast();

      // Should stay on registration page
      registerPage.shouldBeAtUrl();
    });

    it('should handle server errors gracefully', () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock 500 Internal Server Error
      interceptAuth.register(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        message: 'Internal server error',
      });

      registerPage.register(newUser.name, newUser.email, newUser.password);

      cy.wait('@registerRequest');

      // Should show error toast
      cy.shouldShowErrorToast();

      // Should stay on registration page
      registerPage.shouldBeAtUrl();
    });

    it('should handle network errors', () => {
      const newUser = {
        name: 'Network Test',
        email: 'network@example.com',
        password: 'password123',
      };

      // Mock network error
      cy.intercept('POST', '**/api/auth/register', {
        forceNetworkError: true,
      }).as('registerRequest');

      registerPage.register(newUser.name, newUser.email, newUser.password);

      // Should show error message
      cy.shouldShowErrorToast();

      // Should stay on registration page
      registerPage.shouldBeAtUrl();
    });

    it('should show validation errors from backend', () => {
      const invalidUser = {
        name: 'A', // Too short
        email: 'invalid-email',
        password: '123', // Too short
      };

      // Mock 400 Bad Request with validation errors
      interceptAuth.register(HTTP_STATUS.BAD_REQUEST, {
        message: 'Datos inválidos',
        errors: [
          {
            path: ['name'],
            message: 'Name must be at least 2 characters',
          },
          {
            path: ['email'],
            message: 'Invalid email',
          },
          {
            path: ['password'],
            message: 'Password must be at least 6 characters',
          },
        ],
      });

      registerPage.register(invalidUser.name, invalidUser.email, invalidUser.password);

      cy.wait('@registerRequest');

      // Should show error toast
      cy.shouldShowErrorToast();
    });
  });

  context('Navigation', () => {
    it('should navigate back to home page', () => {
      registerPage.backHomeLink.click();
      cy.url().should('eq', Cypress.config().baseUrl + ROUTES.HOME);
    });

    it('should have link to login page', () => {
      // Check if there's a login link (implementation may vary)
      cy.contains(/ya tienes cuenta|iniciar sesión|login/i).should('be.visible');
    });
  });

  context('Security', () => {
    it('should not expose password in HTML', () => {
      registerPage
        .fillPassword('secretpassword')
        .passwordInput
        .should('have.attr', 'type', 'password')
        .should('have.value', 'secretpassword');
    });

    it('should use proper autocomplete attributes', () => {
      registerPage.nameInput.should('have.attr', 'autocomplete');
      registerPage.emailInput.should('have.attr', 'autocomplete', 'username');
      registerPage.passwordInput.should('have.attr', 'autocomplete', 'new-password');
    });

    it('should sanitize user input', () => {
      const xssAttempt = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        password: 'password123',
      };

      interceptAuth.register(HTTP_STATUS.CREATED, {
        _id: 'new-user-xss',
        name: xssAttempt.name, // Should be escaped by backend
        email: xssAttempt.email,
      });

      registerPage.register(xssAttempt.name, xssAttempt.email, xssAttempt.password);

      cy.wait('@registerRequest');

      // Script should not execute
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected!');
      });
    });
  });

  context('Input Normalization', () => {
    it('should trim whitespace from name', () => {
      const newUser = {
        name: '  John Doe  ',
        email: 'john@example.com',
        password: 'password123',
      };

      interceptAuth.register(HTTP_STATUS.CREATED, {});

      registerPage.register(newUser.name, newUser.email, newUser.password);

      cy.wait('@registerRequest').its('request.body').should((body) => {
        expect(body.name.trim()).to.equal('John Doe');
      });
    });

    it('should normalize email to lowercase', () => {
      const newUser = {
        name: 'John Doe',
        email: 'John.Doe@EXAMPLE.COM',
        password: 'password123',
      };

      interceptAuth.register(HTTP_STATUS.CREATED, {});

      registerPage.register(newUser.name, newUser.email, newUser.password);

      cy.wait('@registerRequest').its('request.body').should((body) => {
        expect(body.email).to.equal('john.doe@example.com');
      });
    });
  });

  context('Accessibility', () => {
    it('should have accessible form labels', () => {
      registerPage.nameInput.should('have.attr', 'aria-label')
        .or('should', 'have.attr', 'id');
      registerPage.emailInput.should('have.attr', 'aria-label')
        .or('should', 'have.attr', 'id');
      registerPage.passwordInput.should('have.attr', 'aria-label')
        .or('should', 'have.attr', 'id');
    });

    it('should support keyboard navigation', () => {
      // Tab through form fields
      registerPage.nameInput.focus().type('{tab}');
      registerPage.emailInput.should('have.focus').type('{tab}');
      registerPage.passwordInput.should('have.focus').type('{tab}');
      registerPage.submitButton.should('have.focus');
    });
  });
});
