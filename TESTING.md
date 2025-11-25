# E2E Testing Guide

Complete guide for end-to-end testing with Cypress in the User Control project.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Writing Tests](#writing-tests)
- [Data-cy Attributes](#data-cy-attributes)
- [Page Objects](#page-objects)
- [API Mocking](#api-mocking)
- [Best Practices](#best-practices)
- [Debugging](#debugging)
- [CI/CD Integration](#cicd-integration)

---

## Quick Start

### Requirements

- Node.js 16.19.0
- App running on `http://localhost:3000`
- Backend API on `http://localhost:8000` (configurable)

### Installation

Dependencies are already installed. To reinstall:

```bash
npm install
```

### Running Tests

```bash
# Interactive mode (recommended for development)
npm run cypress:open

# Headless mode (for CI/CD)
npm run cypress:run

# Auto-start server + run tests
npm run e2e

# Auto-start server + interactive mode
npm run e2e:open

# Run specific test
npx cypress run --spec "cypress/e2e/auth/login.cy.js"
```

---

## Architecture

### Folder Structure

```
cypress/
├── e2e/                              # Test specs organized by feature
│   └── auth/
│       └── login.cy.js               # Login flow tests
│
├── fixtures/                         # Test data (mocked)
│   ├── users.json                    # User credentials and data
│   └── api-responses/                # API response mocks
│       ├── auth.json                 # Auth API responses
│       └── users.json                # Users API responses
│
├── support/                          # Reusable code
│   ├── commands/                     # Custom commands by domain
│   │   ├── auth.commands.js          # Auth commands (cy.login, etc.)
│   │   ├── navigation.commands.js    # Navigation commands
│   │   ├── assertions.commands.js    # Custom assertions
│   │   └── index.js                  # Commands aggregator
│   │
│   ├── page-objects/                 # Page Object Pattern
│   │   ├── LoginPage.js              # Login page object
│   │   ├── DashboardPage.js          # Dashboard page object
│   │   └── index.js                  # Centralized exports
│   │
│   ├── api/                          # API utilities
│   │   ├── interceptors.js           # Centralized API mocks
│   │   └── index.js                  # API exports
│   │
│   ├── utils/                        # Utilities
│   │   └── selectors.js              # data-cy selector helpers
│   │
│   ├── constants.js                  # Test constants
│   ├── commands.js                   # Commands entry point
│   └── e2e.js                        # Global config and hooks
│
└── cypress.config.js                 # Cypress configuration
```

### Configuration

File: `cypress.config.js`

```javascript
{
  e2e: {
    baseUrl: 'http://localhost:3000',        // App URL
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,                            // Disable videos
    screenshotOnRunFailure: true,            // Screenshot on fail
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
  env: {
    apiUrl: 'http://localhost:8000',         // Backend API URL
  },
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
}
```

**Override variables:**

```bash
npx cypress run --config baseUrl=http://localhost:3001
npx cypress run --env apiUrl=http://localhost:9000
```

---

## Writing Tests

### Test Template

```javascript
/**
 * Feature Tests
 * Description of what this test suite covers
 */

import { loginPage, dashboardPage } from '../../support/page-objects';
import { interceptAuth } from '../../support/api';
import { ROUTES, HTTP_STATUS } from '../../support/constants';

describe('Feature Flow', () => {
  beforeEach(() => {
    // Common setup for all tests
    loginPage.visit();
  });

  context('Context Name', () => {
    it('should do something specific', () => {
      // Arrange: Setup test data and mocks
      interceptAuth.loginSuccess();

      // Act: Perform user actions
      loginPage.login('user@test.com', 'password');

      // Assert: Verify expected outcomes
      dashboardPage.shouldBeAtUrl('/dashboard');
      cy.checkAuthenticated();
    });
  });
});
```

### Test Organization

Use `describe` and `context` for structure:

```javascript
describe('Login Flow', () => {
  context('Successful Login', () => {
    it('should login with valid credentials', () => {});
    it('should redirect to dashboard', () => {});
  });

  context('Failed Login', () => {
    it('should show error on invalid credentials', () => {});
    it('should handle network errors', () => {});
  });
});
```

### Current Test Coverage

**Implemented:**
- ✅ Login flow (UI, validation, success, errors, security)
- ✅ Form validation
- ✅ API error handling
- ✅ Loading states
- ✅ Navigation

**In Progress:**
- 🔄 User management (list, create, edit, delete)
- 🔄 Dashboard navigation

**Planned:**
- ⏳ User registration
- ⏳ Role-based access control
- ⏳ User search and filters
- ⏳ Responsive design tests

---

## Data-cy Attributes

### Overview

We use `data-cy` attributes for stable, maintainable selectors. All IDs are centralized in constants.

### System Architecture

```
src/constants/testIds.js          ← Source of truth (React)
        ↓
cypress/support/utils/selectors.js ← Mirror for Cypress
        ↓
Tests use cy.getByCy()             ← Clean test code
```

### Naming Convention

**Format**: `[context]-[element]-[action/state]`

**Examples:**
- `login-email-input` ✅
- `users-create-button` ✅
- `sidebar-logout-button` ✅

**Rules:**
- Use `kebab-case`
- Be descriptive and specific
- Include context (page/feature)
- Avoid position-based names
- Keep stable during refactors

### Adding to React Components

**Step 1: Import constants**

```javascript
import { AUTH_TEST_IDS, USERS_TEST_IDS } from '../constants/testIds';
```

**Step 2: Add to elements**

```jsx
// Simple element
<input
  type="email"
  data-cy={AUTH_TEST_IDS.LOGIN_EMAIL_INPUT}
/>

// Button
<button
  type="submit"
  data-cy={AUTH_TEST_IDS.LOGIN_SUBMIT_BUTTON}
>
  Login
</button>

// Container
<div data-cy={USERS_TEST_IDS.USERS_PAGE}>
  {/* content */}
</div>
```

**Step 3: Reusable components**

For atomic components, accept `dataCy` as prop:

```jsx
// Button.jsx
export const Button = ({ children, onClick, dataCy, ...props }) => (
  <button onClick={onClick} data-cy={dataCy} {...props}>
    {children}
  </button>
);

// Usage
<Button dataCy={UI_TEST_IDS.BUTTON_PRIMARY}>
  Submit
</Button>
```

**Step 4: Dynamic IDs (lists)**

```javascript
import { withValue, withIndex } from '../constants/testIds';

// With index
users.map((user, index) => (
  <div key={user.id} data-cy={withIndex('user-list-item', index)}>
    {user.name}
  </div>
));
// Generates: user-list-item-0, user-list-item-1, etc.

// With value (IDs)
<div data-cy={withValue('user-list-item', user.id)}>
  {user.name}
</div>
// Generates: user-list-item-abc123
```

### Using in Cypress Tests

**Method 1: Direct selector**

```javascript
cy.get('[data-cy="login-email-input"]').type('test@example.com');
```

**Method 2: Helper function**

```javascript
import { dataCy } from '../../support/utils/selectors';

cy.get(dataCy('login-email-input')).type('test@example.com');
```

**Method 3: Custom command (recommended)**

```javascript
cy.getByCy('login-email-input').type('test@example.com');
cy.getByCy('login-submit-button').click();
```

**Method 4: Page Objects (best practice)**

```javascript
import { loginPage } from '../../support/page-objects';

loginPage.emailInput.type('test@example.com');
loginPage.submitButton.click();
```

### Available Test IDs

**AUTH_TEST_IDS:**
- `LOGIN_PAGE`, `LOGIN_FORM`
- `LOGIN_EMAIL_INPUT`, `LOGIN_PASSWORD_INPUT`
- `LOGIN_SUBMIT_BUTTON`, `LOGIN_BACK_HOME_LINK`

**LAYOUT_TEST_IDS:**
- `SIDEBAR`, `SIDEBAR_NAV`
- `SIDEBAR_USER_MENU`, `SIDEBAR_LOGOUT_BUTTON`
- `DASHBOARD_CONTAINER`, `DASHBOARD_MAIN_CONTENT`

**USERS_TEST_IDS:**
- `USERS_PAGE`, `USERS_TABLE`, `USERS_SEARCH`
- `USER_FORM`, `USER_FORM_SUBMIT_BUTTON`
- `USER_DELETE_DIALOG`, etc.

**NAV_TEST_IDS:**
- `NAV_DASHBOARD`, `NAV_USERS`

**UI_TEST_IDS:**
- `BUTTON`, `INPUT`, `CARD`, `CHIP`

See `src/constants/testIds.js` for complete list.

### Adding New Test IDs

**1. Define in `src/constants/testIds.js`:**

```javascript
export const MY_FEATURE_TEST_IDS = {
  MY_FEATURE_PAGE: 'my-feature-page',
  MY_FEATURE_BUTTON: 'my-feature-button',
};
```

**2. Export:**

```javascript
export default {
  // ... others
  MY_FEATURE: MY_FEATURE_TEST_IDS,
};
```

**3. Use in component:**

```javascript
import { MY_FEATURE_TEST_IDS } from '../constants/testIds';

<div data-cy={MY_FEATURE_TEST_IDS.MY_FEATURE_PAGE}>
  <button data-cy={MY_FEATURE_TEST_IDS.MY_FEATURE_BUTTON}>
    Submit
  </button>
</div>
```

**4. Update Cypress selectors (optional):**

In `cypress/support/utils/selectors.js`:

```javascript
export const TEST_IDS = {
  // ... others
  MY_FEATURE: {
    MY_FEATURE_PAGE: 'my-feature-page',
    MY_FEATURE_BUTTON: 'my-feature-button',
  },
};
```

**5. Use in tests:**

```javascript
import { TEST_IDS } from '../../support/utils/selectors';

cy.getByCy(TEST_IDS.MY_FEATURE.MY_FEATURE_PAGE).should('be.visible');
```

---

## Page Objects

### Pattern Overview

Page Objects encapsulate page interactions, making tests more readable and maintainable.

### Structure

```javascript
// LoginPage.js
import { TEST_IDS } from '../utils/selectors';

class LoginPage {
  // Getters for elements
  get emailInput() {
    return cy.getByCy(TEST_IDS.AUTH.LOGIN_EMAIL_INPUT);
  }

  get submitButton() {
    return cy.getByCy(TEST_IDS.AUTH.LOGIN_SUBMIT_BUTTON);
  }

  // Actions
  visit() {
    cy.visit('/login');
    return this; // Enable method chaining
  }

  login(email, password) {
    this.emailInput.type(email);
    this.passwordInput.type(password);
    this.submitButton.click();
    return this;
  }

  // Assertions
  shouldBeVisible() {
    this.loginForm.should('be.visible');
    return this;
  }
}

export default LoginPage;
```

### Usage in Tests

```javascript
import { loginPage, dashboardPage } from '../../support/page-objects';

it('should login successfully', () => {
  loginPage
    .visit()
    .login('admin@test.com', 'password123');

  dashboardPage.shouldBeVisible();
});
```

### Available Page Objects

- **LoginPage**: Login page interactions
- **DashboardPage**: Dashboard navigation

### Creating New Page Objects

**1. Create file:**

```javascript
// cypress/support/page-objects/MyPage.js
import { TEST_IDS } from '../utils/selectors';

class MyPage {
  get myElement() {
    return cy.getByCy(TEST_IDS.MY_FEATURE.MY_ELEMENT);
  }

  visit() {
    cy.visit('/my-page');
    return this;
  }

  doAction() {
    this.myElement.click();
    return this;
  }
}

export default MyPage;
```

**2. Export in index:**

```javascript
// cypress/support/page-objects/index.js
import MyPage from './MyPage';

export const myPage = new MyPage();
export { MyPage };
```

**3. Use in tests:**

```javascript
import { myPage } from '../../support/page-objects';

myPage.visit().doAction();
```

---

## API Mocking

### Centralized Interceptors

All API mocks are centralized in `cypress/support/api/interceptors.js`.

### Auth Interceptors

```javascript
import { interceptAuth } from '../../support/api';

// Successful login
interceptAuth.loginSuccess();

// Failed login (401)
interceptAuth.loginFailure('Invalid credentials');

// Server error (500)
interceptAuth.loginServerError();

// Network error
interceptAuth.loginNetworkError();

// Custom response
interceptAuth.login({
  statusCode: 200,
  response: {
    success: true,
    data: { user: {...}, token: 'xyz' }
  },
  alias: 'loginRequest'
});
```

### Users Interceptors

```javascript
import { interceptUsers } from '../../support/api';

// List users
interceptUsers.list();

// With custom data
interceptUsers.list([user1, user2, user3]);

// User detail
interceptUsers.detail(userId, userData);

// Create user
interceptUsers.create(201, responseData);

// Update user
interceptUsers.update(userId);

// Delete user
interceptUsers.delete(userId);
```

### Custom Interceptor

```javascript
cy.intercept('POST', '**/api/my-endpoint', {
  statusCode: 200,
  body: { success: true, data: {...} }
}).as('myRequest');

// Wait for it
cy.wait('@myRequest');
```

### With Delay (test loading states)

```javascript
cy.intercept('POST', '**/api/auth/login', (req) => {
  req.reply({
    delay: 1000, // 1 second delay
    statusCode: 200,
    body: { success: true }
  });
}).as('loginRequest');
```

### Using Fixtures

```javascript
cy.intercept('GET', '**/api/users', {
  fixture: 'api-responses/users.json'
}).as('usersRequest');
```

---

## Best Practices

### Selectors

**Priority (best to worst):**

1. `data-cy`: `cy.getByCy('login-submit-button')` ✅
2. `data-testid`: `cy.get('[data-testid="submit"]')`
3. Semantic attributes: `cy.get('button[type="submit"]')`
4. `name`: `cy.get('input[name="email"]')`
5. Text content: `cy.contains('Submit')`
6. ID: `cy.get('#submit-btn')` (if stable)
7. Classes: ❌ Avoid - change frequently

**Always prefer `data-cy` over other selectors.**

### Test Independence

Each test should be independent:

```javascript
beforeEach(() => {
  // Reset state
  cy.clearLocalStorage();
  cy.clearCookies();

  // Setup test data
  interceptAuth.loginSuccess();
});
```

### Assertions

Be explicit with assertions:

```javascript
// ❌ Implicit
cy.get('[data-cy="button"]');

// ✅ Explicit
cy.getByCy('button').should('be.visible');
cy.getByCy('button').should('not.be.disabled');
```

### Waiting

Cypress automatically waits, but be explicit when needed:

```javascript
// Wait for API call
cy.wait('@loginRequest');

// Custom timeout
cy.getByCy('slow-element', { timeout: 10000 }).should('exist');
```

### Fixtures over Hardcoded Data

```javascript
// ❌ Hardcoded
cy.getByCy('email-input').type('test@example.com');

// ✅ Use fixtures
cy.fixture('users').then((users) => {
  cy.getByCy('email-input').type(users.credentials.admin.email);
});
```

### Clean Test Code

```javascript
// ❌ Repetitive
cy.get('[data-cy="email"]').type('test@test.com');
cy.get('[data-cy="password"]').type('password');
cy.get('[data-cy="submit"]').click();

// ✅ Use Page Objects
loginPage.login('test@test.com', 'password');
```

### Test Names

Be descriptive:

```javascript
// ✅ Good
it('should show error message on invalid credentials', () => {});
it('should redirect to dashboard after successful login', () => {});

// ❌ Bad
it('test login', () => {});
it('it works', () => {});
```

---

## Debugging

### Interactive Mode

```bash
npm run cypress:open
```

**Features:**
- See tests run in real-time
- Time travel through steps
- Inspect DOM at each step
- See network requests
- View console logs

### Screenshots

On test failure, screenshot is saved to `cypress/screenshots/`

### Videos

Enable in `cypress.config.js`:

```javascript
{
  video: true  // Saves to cypress/videos/
}
```

Only recorded in headless mode (`cypress run`).

### Debug Commands

```javascript
// Pause execution
cy.pause();

// Log to Cypress console
cy.log('Custom log message');

// Debug element
cy.getByCy('button').debug();

// Browser debugger
cy.getByCy('button').then(($btn) => {
  console.log($btn);
  debugger; // Pauses in DevTools
});
```

### Common Issues

**Element not found:**

```javascript
// Check selector exists
cy.getByCy('my-element').should('exist');

// Increase timeout
cy.getByCy('my-element', { timeout: 10000 });

// Wait for API
cy.wait('@apiCall');
```

**Test passes locally, fails in CI:**

- Increase timeouts in `cypress.config.js`
- Use `cy.wait()` for API calls
- Check environment variables
- Verify data-cy attributes exist

**Flaky tests:**

- Add explicit waits (`cy.wait('@apiCall')`)
- Use `.should()` assertions (retry-able)
- Avoid fixed `cy.wait(1000)` delays
- Mock API responses consistently

---

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.19.0'

      - name: Install dependencies
        run: npm ci

      - name: Run E2E tests
        run: npm run e2e

      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-screenshots
          path: cypress/screenshots

      - name: Upload videos
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-videos
          path: cypress/videos
```

### Environment Variables

Set in CI:

```bash
REACT_APP_API_URL=https://api.staging.com
```

Or in GitHub Actions:

```yaml
env:
  REACT_APP_API_URL: ${{ secrets.API_URL }}
```

---

## Custom Commands

### Available Commands

**Auth:**
- `cy.login(email, password)` - Login via UI
- `cy.loginByAPI(credentials)` - Login programmatically
- `cy.checkAuthenticated()` - Verify user is logged in
- `cy.checkNotAuthenticated()` - Verify user is logged out
- `cy.setAuthState(userData)` - Set auth state directly
- `cy.clearAuth()` - Clear auth state

**Navigation:**
- `cy.shouldBeAt(path)` - Verify current URL
- `cy.visitProtected(path, userData)` - Visit protected route with auth

**Assertions:**
- `cy.shouldShowErrorToast(message)` - Verify error toast
- `cy.shouldShowSuccessToast(message)` - Verify success toast
- `cy.shouldHaveValidationError(fieldName)` - Verify field validation
- `cy.shouldHaveInLocalStorage(key, value)` - Verify localStorage

**Selectors:**
- `cy.getByCy(testId)` - Get element by data-cy
- `cy.findByCy(testId)` - Find element by data-cy (chainable)

### Creating Custom Commands

```javascript
// cypress/support/commands/myfeature.commands.js

/**
 * Does something specific
 * @param {string} param - Description
 * @example cy.myCommand('value')
 */
Cypress.Commands.add('myCommand', (param) => {
  // Implementation
});

// Import in cypress/support/commands/index.js
import './myfeature.commands';
```

---

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/)
- [Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)
- [API Testing Guide](https://docs.cypress.io/guides/guides/network-requests)

---

## Troubleshooting

### Cypress won't open

```bash
npx cypress verify
npx cypress open --browser chrome
```

### Port already in use

```bash
PORT=3001 npm start
npx cypress run --config baseUrl=http://localhost:3001
```

### Tests timeout

Increase in `cypress.config.js`:

```javascript
{
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  responseTimeout: 15000
}
```

### Import errors

Check file paths are correct:

```javascript
// ✅ Correct (relative path)
import { loginPage } from '../../support/page-objects';

// ❌ Wrong (absolute path won't work)
import { loginPage } from 'support/page-objects';
```

---

## Contributing

When adding tests:

1. Follow existing patterns (Page Objects, interceptors)
2. Use `data-cy` attributes for selectors
3. Add constants to `testIds.js`
4. Write descriptive test names
5. Test both success and error cases
6. Mock API responses
7. Update this documentation if needed

---

**Quick Links:**
- [Main README](./README.md)
- [Test ID Constants](./src/constants/testIds.js)
- [Cypress Config](./cypress.config.js)
