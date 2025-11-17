/* eslint-disable no-undef */
// ============================================================================
// Custom Commands for E2E Testing - User Control System
// ============================================================================

/**
 * Login via UI
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add("loginUI", (email, password) => {
  cy.visit("/login");
  cy.get('[data-cy="login-input-email"]').clear().type(email);
  cy.get('[data-cy="login-input-password"]').clear().type(password);
  cy.get('[data-cy="login-submit-button"]').click();
});

/**
 * Login and store session in localStorage
 * @param {Object} user - User object with email and other properties
 */
Cypress.Commands.add("loginByLocalStorage", (user = {}) => {
  const defaultUser = {
    email: "test@example.com",
    name: "Test User",
    role: "SELLER",
    status: "ACTIVE",
    _id: "test-user-id",
    id: "test-user-id"
  };
  
  const userData = { ...defaultUser, ...user };
  
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem("user", JSON.stringify(userData));
    }
  });
});

/**
 * Login as admin user
 */
Cypress.Commands.add("loginAsAdmin", () => {
  cy.loginByLocalStorage({
    email: "admin@example.com",
    name: "Admin User",
    role: "ADMIN",
    status: "ACTIVE",
  });
});

/**
 * Logout via clearing localStorage
 */
Cypress.Commands.add("logout", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("user");
  });
  cy.visit("/login");
});

/**
 * Navigate to users list page
 */
Cypress.Commands.add("goToUsersList", () => {
  cy.visit("/dashboard/users");
});

/**
 * Search for users
 * @param {string} searchTerm - Search term
 */
Cypress.Commands.add("searchUsers", (searchTerm) => {
  cy.get('[data-cy="users-search-input"]').clear().type(searchTerm);
});

/**
 * Clear user search
 */
Cypress.Commands.add("clearUserSearch", () => {
  cy.get('[data-cy="users-search-input"]').clear();
});

/**
 * Filter users by status
 * @param {string} status - User status (ACTIVE, INACTIVE)
 */
Cypress.Commands.add("filterUsersByStatus", (status) => {
  if (status === "ACTIVE") {
    cy.get('[data-cy="filter-status-active"]').click();
  } else if (status === "INACTIVE") {
    cy.get('[data-cy="filter-status-inactive"]').click();
  }
});

/**
 * Filter users by role
 * @param {string} role - User role (ADMIN, SELLER)
 */
Cypress.Commands.add("filterUsersByRole", (role) => {
  if (role === "ADMIN") {
    cy.get('[data-cy="filter-role-admin"]').click();
  } else if (role === "SELLER") {
    cy.get('[data-cy="filter-role-user"]').click();
  }
});

/**
 * Clear all filters
 */
Cypress.Commands.add("clearAllFilters", () => {
  cy.get('[data-cy="filter-clear-all"]').click();
});

/**
 * Open create user page
 */
Cypress.Commands.add("openCreateUserPage", () => {
  cy.get('[data-cy="users-create-button"]').click();
});

/**
 * Fill user form
 * @param {Object} userData - User data object
 */
Cypress.Commands.add("fillUserForm", (userData) => {
  const defaultData = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
    phone: "+1234567890",
    branch: "Branch 1",
    role: "SELLER",
    status: "ACTIVE",
  };
  
  const data = { ...defaultData, ...userData };
  
  if (data.name) {
    cy.get('[data-cy="user-form-input-name"]').clear().type(data.name);
  }
  if (data.email) {
    cy.get('[data-cy="user-form-input-email"]').clear().type(data.email);
  }
  if (data.password) {
    cy.get('[data-cy="user-form-input-password"]').clear().type(data.password);
  }
  if (data.phone) {
    cy.get('[data-cy="user-form-input-phone"]').clear().type(data.phone);
  }
  if (data.branch) {
    cy.get('[data-cy="user-form-input-branch"]').clear().type(data.branch);
  }
  if (data.role) {
    cy.get('[data-cy="user-form-select-role"]').select(data.role);
  }
  // Status is only available in edit mode
  if (data.status && cy.get('[data-cy="user-form-select-status"]').should('exist')) {
    cy.get('[data-cy="user-form-select-status"]').select(data.status);
  }
});

/**
 * Submit user form
 */
Cypress.Commands.add("submitUserForm", () => {
  cy.get('[data-cy="user-form-submit-button"]').click();
});

/**
 * Cancel user form
 */
Cypress.Commands.add("cancelUserForm", () => {
  cy.get('[data-cy="user-form-cancel-button"]').click();
});

/**
 * Wait for users table to load
 */
Cypress.Commands.add("waitForUsersTable", () => {
  cy.get('[data-cy="users-table"]', { timeout: 10000 }).should('be.visible');
});

/**
 * Open user actions menu
 * @param {number} rowIndex - Index of the user row (0-based)
 */
Cypress.Commands.add("openUserActionsMenu", (rowIndex = 0) => {
  cy.get('[data-cy="users-table-row"]')
    .eq(rowIndex)
    .find('[data-cy="user-row-actions-button"]')
    .click();
});

/**
 * Click user action from menu
 * @param {string} action - Action type (view, edit, changeRole, block, unblock, resetPassword)
 */
Cypress.Commands.add("clickUserAction", (action) => {
  cy.get(`[data-cy="user-action-${action}"]`).click();
});

/**
 * Intercept API calls for authentication
 */
Cypress.Commands.add("interceptAuth", () => {
  cy.intercept("POST", "**/api/auth/login").as("loginRequest");
  cy.intercept("POST", "**/api/auth/register").as("registerRequest");
  cy.intercept("POST", "**/api/auth/logout").as("logoutRequest");
  cy.intercept("GET", "**/api/auth/me").as("meRequest");
});

/**
 * Intercept API calls for users
 */
Cypress.Commands.add("interceptUsers", () => {
  cy.intercept("GET", "**/api/users*").as("getUsers");
  cy.intercept("GET", "**/api/users/*").as("getUser");
  cy.intercept("POST", "**/api/users").as("createUser");
  cy.intercept("PUT", "**/api/users/*").as("updateUser");
  cy.intercept("PATCH", "**/api/users/*/role").as("changeRole");
  cy.intercept("PATCH", "**/api/users/*/block").as("blockUser");
  cy.intercept("PATCH", "**/api/users/*/unblock").as("unblockUser");
  cy.intercept("POST", "**/api/users/*/reset-password").as("resetPassword");
});
