# Cypress E2E Testing Documentation

This directory contains comprehensive end-to-end tests for the ecommerce-lite-frontend application.

## Overview

The test suite covers all major user flows and edge cases:

1. **Authentication Flow** (`01-auth.cy.js`)
   - Login with valid/invalid credentials
   - Form validation
   - Session management
   - Protected routes
   - Session expiration

2. **Product Browsing Flow** (`02-products.cy.js`)
   - Product grid display
   - Product search
   - Load more products
   - Product details
   - Empty states

3. **Shopping Cart Flow** (`03-cart.cy.js`)
   - Add/remove products
   - Update quantities
   - Cart persistence
   - Cart sidebar navigation

4. **Checkout Flow** (`04-checkout.cy.js`)
   - Form validation
   - Order submission
   - Error handling
   - Order confirmation

5. **Complete User Journey** (`05-complete-journey.cy.js`)
   - End-to-end flows
   - Error recovery
   - Multiple purchase cycles
   - Session persistence

## Running Tests

### Prerequisites

Make sure you have installed dependencies:

```bash
npm install
```

### Run Tests in Interactive Mode

Open Cypress Test Runner for development:

```bash
npm run test:e2e:open
```

This will open the Cypress UI where you can:
- Select and run individual test files
- Watch tests run in real-time
- Debug failing tests
- View detailed error messages

### Run Tests in Headless Mode

Run all tests in CI/CD mode:

```bash
npm run test:e2e:run
```

This command:
- Runs all tests in headless mode
- Generates video recordings
- Exits with appropriate status code for CI/CD

### Run Specific Test File

```bash
npx cypress run --spec "cypress/e2e/01-auth.cy.js"
```

### Run Tests in Specific Browser

```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

## Test Structure

### Custom Commands

Located in `cypress/support/commands.js`, these commands simplify common operations:

- `cy.loginUI(email, password, remember)` - Login via UI
- `cy.loginByLocalStorage(user)` - Login by setting localStorage
- `cy.addProductToCart(index)` - Add product to cart
- `cy.openCart()` - Open cart sidebar
- `cy.searchProducts(term)` - Search for products
- `cy.fillCheckoutForm(data)` - Fill checkout form
- `cy.interceptProducts(fixture)` - Mock product API
- `cy.interceptAuth()` - Mock authentication API
- `cy.interceptOrders()` - Mock order API

### Fixtures

Test data is stored in `cypress/fixtures/`:

- `products.json` - Sample product data
- `auth-success.json` - Successful authentication response
- `auth-error.json` - Failed authentication response
- `order-success.json` - Successful order response

## Test Configuration

Configuration is in `cypress.config.js`:

```javascript
{
  baseUrl: "http://localhost:3000",
  video: true,
  chromeWebSecurity: false,
  retries: { runMode: 2, openMode: 0 }
}
```

### Environment Variables

Set in `cypress.config.js` under `env`:

- `API_URL` - Backend API URL (default: http://localhost:3001/api)

## Best Practices

### 1. Use Data Attributes

Tests use `data-cy` attributes for stable selectors:

```html
<button data-cy="login-submit-button">Login</button>
```

```javascript
cy.get('[data-cy="login-submit-button"]').click()
```

### 2. Intercept API Calls

Mock backend responses for reliable tests:

```javascript
cy.intercept("GET", "**/api/product/public/vip*", {
  statusCode: 200,
  fixture: "products.json"
}).as("getProducts");

cy.wait("@getProducts");
```

### 3. Clean State

Each test starts with a clean state:

```javascript
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.clearCart();
});
```

### 4. Test Isolation

Tests don't depend on each other:

```javascript
// Good - independent test
it("should login", () => {
  cy.visit("/login");
  cy.loginUI("user@example.com", "password");
});

// Bad - depends on previous test
it("should show products", () => {
  // Assumes already logged in
  cy.get('[data-cy="product-grid"]').should("exist");
});
```

### 5. Wait for Elements

Wait for elements to be visible before interacting:

```javascript
cy.get('[data-cy="product-grid"]').should("be.visible");
cy.get('[data-cy="product-card"]').first().click();
```

## Debugging Tests

### 1. Use Cypress UI

Run `npm run test:e2e:open` to see tests run in real-time with:
- Time travel debugging
- Selector playground
- Network requests
- Console logs

### 2. Add Debug Statements

```javascript
cy.get('[data-cy="cart-count"]').debug();
cy.pause(); // Pause execution
```

### 3. Take Screenshots

```javascript
cy.screenshot("cart-with-items");
```

### 4. Check Videos

Videos are saved in `cypress/videos/` after test runs.

## Common Issues

### Issue: Tests fail due to timing

**Solution**: Add explicit waits

```javascript
cy.get('[data-cy="element"]', { timeout: 10000 }).should("be.visible");
```

### Issue: API intercepts not working

**Solution**: Ensure intercepts are set before visiting page

```javascript
cy.intercept("GET", "**/api/products").as("getProducts");
cy.visit("/");
cy.wait("@getProducts");
```

### Issue: Elements not found

**Solution**: Check if element is in viewport or needs scrolling

```javascript
cy.get('[data-cy="element"]').scrollIntoView().should("be.visible");
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Cypress tests
  run: npm run test:e2e:run
  
- name: Upload videos
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: cypress-videos
    path: cypress/videos
```

## Test Coverage

The test suite covers:

- ✅ Login/Authentication (valid, invalid, validation)
- ✅ Product browsing (search, filter, pagination)
- ✅ Cart management (add, remove, update quantities)
- ✅ Checkout process (form validation, submission)
- ✅ Order confirmation
- ✅ Error handling and recovery
- ✅ Session persistence
- ✅ Protected routes
- ✅ Empty states
- ✅ Edge cases

## Maintenance

### Adding New Tests

1. Create new test file in `cypress/e2e/`
2. Follow naming convention: `##-feature-name.cy.js`
3. Use existing custom commands
4. Add fixtures if needed
5. Update this README

### Updating Selectors

If UI changes, update `data-cy` attributes in:
1. Component files
2. Test files
3. Custom commands

### Adding Custom Commands

Add new commands in `cypress/support/commands.js`:

```javascript
Cypress.Commands.add("customCommand", (param) => {
  // Implementation
});
```

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Commands](https://docs.cypress.io/api/table-of-contents)
