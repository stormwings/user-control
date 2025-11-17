/* eslint-disable no-undef */
// ============================================================================
// Custom Commands for E2E Testing
// ============================================================================

/**
 * Login via UI
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} remember - Remember me checkbox
 */
Cypress.Commands.add("loginUI", (email, password, remember = true) => {
  cy.visit("/login");
  cy.get('[data-cy="login-input-email"]').clear().type(email);
  cy.get('[data-cy="login-input-password"]').clear().type(password);
  
  if (!remember) {
    cy.get('[data-cy="login-remember-checkbox"]').uncheck();
  }
  
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
    admin: false,
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
 * Logout via UI
 */
Cypress.Commands.add("logoutUI", () => {
  // Assuming there's a logout button in the header
  cy.get('[data-cy="logout-button"]').click();
});

/**
 * Add product to cart by clicking on product card
 * @param {number} productIndex - Index of the product in the grid (0-based)
 */
Cypress.Commands.add("addProductToCart", (productIndex = 0) => {
  cy.get('[data-cy="product-grid"]')
    .find('[data-cy="product-card"]')
    .eq(productIndex)
    .find('[data-cy="product-add-to-cart"]')
    .click();
});

/**
 * Open the shopping cart sidebar
 */
Cypress.Commands.add("openCart", () => {
  cy.get('[data-cy="header-cart-button"]').click();
  cy.get('[data-cy="sidebar"]').should('be.visible');
});

/**
 * Close the shopping cart sidebar
 */
Cypress.Commands.add("closeCart", () => {
  cy.get('[data-cy="sidebar-close-button"]').click();
});

/**
 * Clear all items from cart
 */
Cypress.Commands.add("clearCart", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("cart");
  });
});

/**
 * Search for products
 * @param {string} searchTerm - Search term
 */
Cypress.Commands.add("searchProducts", (searchTerm) => {
  cy.get('[data-cy="search-input"]').clear().type(searchTerm);
});

/**
 * Clear search
 */
Cypress.Commands.add("clearSearch", () => {
  cy.get('[data-cy="search-clear-button"]').click();
});

/**
 * Wait for products to load
 */
Cypress.Commands.add("waitForProducts", () => {
  cy.get('[data-cy="product-grid"]', { timeout: 10000 }).should('be.visible');
});

/**
 * Intercept API calls for products
 */
Cypress.Commands.add("interceptProducts", (fixture = "products") => {
  cy.intercept("GET", "**/api/product/public/vip*", {
    fixture: fixture
  }).as("getProducts");
});

/**
 * Intercept API calls for authentication
 */
Cypress.Commands.add("interceptAuth", () => {
  cy.intercept("POST", "**/api/auth/login").as("loginRequest");
  cy.intercept("POST", "**/api/auth/logout").as("logoutRequest");
  cy.intercept("GET", "**/api/auth/me").as("meRequest");
});

/**
 * Intercept API calls for orders
 */
Cypress.Commands.add("interceptOrders", () => {
  cy.intercept("POST", "**/api/order/public").as("createOrder");
});

/**
 * Fill checkout form
 * @param {Object} formData - Form data object
 */
Cypress.Commands.add("fillCheckoutForm", (formData) => {
  const defaultData = {
    name: "Test Customer",
    email: "customer@example.com",
    phone: "1234567890",
    docType: "DNI",
    docNumber: "12345678",
    taxCondition: "CF",
    province: "Buenos Aires",
    zipcode: "1000",
    notes: "Test order"
  };
  
  const data = { ...defaultData, ...formData };
  
  if (data.name) cy.get('[name="name"]').clear().type(data.name);
  if (data.email) cy.get('[name="email"]').clear().type(data.email);
  if (data.phone) cy.get('[name="phone"]').clear().type(data.phone);
  if (data.docType) cy.get('[name="docType"]').clear().type(data.docType);
  if (data.docNumber) cy.get('[name="docNumber"]').clear().type(data.docNumber);
  if (data.taxCondition) cy.get('[name="taxCondition"]').clear().type(data.taxCondition);
  if (data.province) cy.get('[name="province"]').clear().type(data.province);
  if (data.zipcode) cy.get('[name="zipcode"]').clear().type(data.zipcode);
  if (data.notes) cy.get('[name="notes"]').clear().type(data.notes);
});
