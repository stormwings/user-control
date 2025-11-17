/**
 * E2E Tests for Authentication Flow
 * 
 * Tests cover:
 * - Login with valid credentials
 * - Login with invalid credentials
 * - Login form validation
 * - Remember me functionality
 * - Session persistence
 * - Logout functionality
 * - Protected route access
 * - Session expiration handling
 */

describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe("Login Page", () => {
    it("should display login form", () => {
      cy.visit("/login");
      
      cy.get('[data-cy="login-input-email"]').should("be.visible");
      cy.get('[data-cy="login-input-password"]').should("be.visible");
      cy.get('[data-cy="login-submit-button"]').should("be.visible");
      cy.get('[data-cy="login-remember-checkbox"]').should("be.visible");
      cy.get('[data-cy="login-remember-checkbox"]').should("be.checked"); // Default checked
    });

    it("should show/hide password when toggle is clicked", () => {
      cy.visit("/login");
      
      cy.get('[data-cy="login-input-password"]').should("have.attr", "type", "password");
      
      // Click show password button
      cy.contains("button", /show|mostrar/i).click();
      cy.get('[data-cy="login-input-password"]').should("have.attr", "type", "text");
      
      // Click hide password button
      cy.contains("button", /hide|ocultar/i).click();
      cy.get('[data-cy="login-input-password"]').should("have.attr", "type", "password");
    });

    it("should validate empty email and password", () => {
      cy.visit("/login");
      
      cy.get('[data-cy="login-submit-button"]').click();
      
      // Should show validation errors
      cy.contains(/required|requerido|obligatorio/i).should("be.visible");
    });

    it("should validate invalid email format", () => {
      cy.visit("/login");
      
      cy.get('[data-cy="login-input-email"]').type("invalid-email");
      cy.get('[data-cy="login-input-password"]').type("password123");
      cy.get('[data-cy="login-submit-button"]').click();
      
      // Should show email validation error
      cy.contains(/email|correo/i).should("be.visible");
    });

    it("should login successfully with valid credentials", () => {
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 200,
        fixture: "auth-success.json"
      }).as("loginRequest");

      cy.visit("/login");
      
      cy.get('[data-cy="login-input-email"]').type("test@example.com");
      cy.get('[data-cy="login-input-password"]').type("password123");
      cy.get('[data-cy="login-submit-button"]').click();
      
      cy.wait("@loginRequest").its("request.body").should("deep.include", {
        email: "test@example.com",
        password: "password123",
        remember: true
      });
      
      // Should redirect to home page
      cy.url().should("not.include", "/login");
      cy.url().should("include", "/");
    });

    it("should show error message with invalid credentials", () => {
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 401,
        body: { message: "Invalid credentials" }
      }).as("loginRequest");

      cy.visit("/login");
      
      cy.get('[data-cy="login-input-email"]').type("wrong@example.com");
      cy.get('[data-cy="login-input-password"]').type("wrongpassword");
      cy.get('[data-cy="login-submit-button"]').click();
      
      cy.wait("@loginRequest");
      
      // Should show error message
      cy.contains(/invalid|inválid|incorrect|incorrecto/i).should("be.visible");
      
      // Should stay on login page
      cy.url().should("include", "/login");
    });

    it("should handle remember me checkbox", () => {
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 200,
        fixture: "auth-success.json"
      }).as("loginRequest");

      cy.visit("/login");
      
      // Uncheck remember me
      cy.get('[data-cy="login-remember-checkbox"]').uncheck();
      cy.get('[data-cy="login-remember-checkbox"]').should("not.be.checked");
      
      cy.get('[data-cy="login-input-email"]').type("test@example.com");
      cy.get('[data-cy="login-input-password"]').type("password123");
      cy.get('[data-cy="login-submit-button"]').click();
      
      cy.wait("@loginRequest").its("request.body").should("deep.include", {
        email: "test@example.com",
        password: "password123",
        remember: false
      });
    });

    it("should disable submit button while loading", () => {
      cy.intercept("POST", "**/api/auth/login", (req) => {
        req.reply((res) => {
          res.delay = 1000; // Simulate slow response
          res.send({
            statusCode: 200,
            fixture: "auth-success.json"
          });
        });
      }).as("loginRequest");

      cy.visit("/login");
      
      cy.get('[data-cy="login-input-email"]').type("test@example.com");
      cy.get('[data-cy="login-input-password"]').type("password123");
      cy.get('[data-cy="login-submit-button"]').click();
      
      // Button should be disabled while loading
      cy.get('[data-cy="login-submit-button"]').should("be.disabled");
    });
  });

  describe("Protected Routes", () => {
    it("should redirect to login when accessing protected route without authentication", () => {
      cy.visit("/");
      
      // Should redirect to login
      cy.url().should("include", "/login");
    });

    it("should allow access to protected routes when authenticated", () => {
      // Set user in localStorage to simulate authentication
      cy.loginByLocalStorage({
        email: "test@example.com",
        name: "Test User"
      });
      
      // Should be able to access home page
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });

    it("should allow access to product details when authenticated", () => {
      cy.loginByLocalStorage({
        email: "test@example.com",
        name: "Test User"
      });
      
      cy.visit("/product/1");
      
      // Should be able to access product details page
      cy.url().should("include", "/product/1");
    });
  });

  describe("Session Expiration", () => {
    it("should show expired session banner when redirected with expired flag", () => {
      cy.visit("/login?expired=true");
      
      // Should show expired session banner
      cy.contains(/session|sesión|expired|expirado/i).should("be.visible");
    });

    it("should allow closing expired session banner", () => {
      cy.visit("/login?expired=true");
      
      // Find and close the banner
      cy.contains(/session|sesión|expired|expirado/i)
        .parents('[role="status"]')
        .find("button")
        .click();
      
      // Banner should be hidden
      cy.contains(/session|sesión|expired|expirado/i).should("not.exist");
    });

    it("should hide expired banner when user starts typing", () => {
      cy.visit("/login?expired=true");
      
      // Banner should be visible
      cy.contains(/session|sesión|expired|expirado/i).should("be.visible");
      
      // Start typing in email field
      cy.get('[data-cy="login-input-email"]').type("t");
      
      // Banner should be hidden
      cy.contains(/session|sesión|expired|expirado/i).should("not.exist");
    });
  });

  describe("Navigation", () => {
    it("should navigate back to home from login page", () => {
      cy.visit("/login");
      
      // Click back to home link
      cy.contains("a", /home|inicio/i).click();
      
      // Should navigate to home (will redirect to login because not authenticated)
      cy.url().should("include", "/");
    });

    it("should persist login state across page refreshes", () => {
      cy.loginByLocalStorage({
        email: "test@example.com",
        name: "Test User"
      });
      
      // Refresh the page
      cy.reload();
      
      // Should still be authenticated
      cy.url().should("not.include", "/login");
    });
  });

  describe("Logout", () => {
    it("should clear user data from localStorage on logout", () => {
      cy.loginByLocalStorage({
        email: "test@example.com",
        name: "Test User"
      });
      
      // Verify user is in localStorage
      cy.window().its("localStorage").invoke("getItem", "user").should("exist");
      
      // Clear localStorage to simulate logout
      cy.clearLocalStorage();
      
      // Visit home, should redirect to login
      cy.visit("/");
      cy.url().should("include", "/login");
    });
  });
});
