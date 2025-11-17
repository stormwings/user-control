# Cypress E2E Testing Documentation - User Control System

This directory contains comprehensive end-to-end tests for the User Control (User Management) application.

## Overview

The test suite covers all major user management flows and edge cases:

1. **Authentication Flow** (`01-auth.cy.js`)
   - Login with valid/invalid credentials
   - Form validation
   - Session management
   - Protected routes
   - Registration flow
   - Logout functionality

2. **Users List Flow** (`02-users-list.cy.js`)
   - Users table display
   - Search functionality
   - Filter by status (Active/Inactive)
   - Filter by role (Admin/User)
   - Pagination
   - User row actions
   - Error handling

3. **User Creation Flow** (`03-user-create.cy.js`)
   - Form display and validation
   - Required field validation
   - Email format validation
   - Password length validation
   - Role selection
   - Success/error handling

4. **User Edit Flow** (`04-user-edit.cy.js`)
   - Pre-filled form display
   - Update user information
   - Change user role
   - Change user status
   - Form validation
   - Cancel editing

5. **User Actions Flow** (`05-user-actions.cy.js`)
   - Change role dialog
   - Block/unblock user
   - Reset password
   - Deactivate user

6. **Complete Journey** (`06-complete-journey.cy.js`)
   - Full user lifecycle workflows
   - Search and filter workflows
   - Error recovery scenarios
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
npx cypress open
```

This will open the Cypress UI where you can:
- Select and run individual test files
- Watch tests run in real-time
- Debug failing tests
- View detailed error messages

### Run Tests in Headless Mode

Run all tests in CI/CD mode:

```bash
npx cypress run
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

**Authentication:**
- `cy.loginUI(email, password)` - Login via UI
- `cy.loginByLocalStorage(user)` - Login by setting localStorage
- `cy.loginAsAdmin()` - Login as admin user
- `cy.logout()` - Logout and clear session

**Navigation:**
- `cy.goToUsersList()` - Navigate to users list page
- `cy.openCreateUserPage()` - Open create user page

**Search & Filter:**
- `cy.searchUsers(term)` - Search for users
- `cy.clearUserSearch()` - Clear search input
- `cy.filterUsersByStatus(status)` - Filter by status
- `cy.filterUsersByRole(role)` - Filter by role
- `cy.clearAllFilters()` - Clear all filters

**Forms:**
- `cy.fillUserForm(data)` - Fill user form
- `cy.submitUserForm()` - Submit user form
- `cy.cancelUserForm()` - Cancel user form

**Actions:**
- `cy.openUserActionsMenu(rowIndex)` - Open user actions menu
- `cy.clickUserAction(action)` - Click user action
- `cy.waitForUsersTable()` - Wait for users table to load

**API Mocking:**
- `cy.interceptAuth()` - Mock authentication API
- `cy.interceptUsers()` - Mock users API

### Fixtures

Test data is stored in `cypress/fixtures/`:

- `auth-success.json` - Successful authentication response
- `users.json` - List of users with different roles/statuses
- `user-detail.json` - Single user details
- `user-create-success.json` - Successful user creation response

## Test Configuration

Configuration is in `cypress.config.js`:

```javascript
{
  baseUrl: "http://localhost:3000",
  video: true,
  chromeWebSecurity: false,
  retries: { runMode: 2, openMode: 0 },
  env: {
    API_URL: "http://localhost:3001/api"
  }
}
```

## Best Practices

### 1. Use Data Attributes

Tests use `data-cy` attributes for stable selectors:

```html
<button data-cy="user-form-submit-button">Guardar</button>
```

```javascript
cy.get('[data-cy="user-form-submit-button"]').click()
```

### 2. Intercept API Calls

Mock backend responses for reliable tests:

```javascript
cy.intercept("GET", "**/api/users*", {
  statusCode: 200,
  fixture: "users.json"
}).as("getUsers");

cy.wait("@getUsers");
```

### 3. Clean State

Each test starts with a clean state:

```javascript
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
```

### 4. Test Isolation

Tests don't depend on each other:

```javascript
// Good - independent test
it("should login", () => {
  cy.visit("/login");
  cy.loginUI("admin@example.com", "password");
});

// Bad - depends on previous test
it("should show users", () => {
  // Assumes already logged in
  cy.get('[data-cy="users-table"]').should("exist");
});
```

### 5. Wait for Elements

Wait for elements to be visible before interacting:

```javascript
cy.get('[data-cy="users-table"]').should("be.visible");
cy.get('[data-cy="users-table-row"]').first().click();
```

## Debugging Tests

### 1. Use Cypress UI

Run `npx cypress open` to see tests run in real-time with:
- Time travel debugging
- Selector playground
- Network requests
- Console logs

### 2. Add Debug Statements

```javascript
cy.get('[data-cy="users-table"]').debug();
cy.pause(); // Pause execution
```

### 3. Take Screenshots

```javascript
cy.screenshot("users-list");
```

### 4. Check Videos

Videos are saved in `cypress/videos/` after test runs.

## Common Issues

### Issue: Tests fail due to timing

**Solution**: Add explicit waits

```javascript
cy.get('[data-cy="users-table"]', { timeout: 10000 }).should("be.visible");
```

### Issue: API intercepts not working

**Solution**: Ensure intercepts are set before visiting page

```javascript
cy.intercept("GET", "**/api/users*").as("getUsers");
cy.visit("/dashboard/users");
cy.wait("@getUsers");
```

### Issue: Elements not found

**Solution**: Check if element is in viewport or needs scrolling

```javascript
cy.get('[data-cy="user-form-submit-button"]').scrollIntoView().should("be.visible");
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Cypress tests
  run: npx cypress run
  
- name: Upload videos
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: cypress-videos
    path: cypress/videos
```

## Test Coverage

The test suite covers:

- ✅ Login/Authentication (valid, invalid, validation, registration)
- ✅ User listing (search, filter, pagination)
- ✅ User creation (validation, success, errors)
- ✅ User editing (update info, change role, change status)
- ✅ User actions (block, reset password, change role)
- ✅ Complete workflows (full lifecycle)
- ✅ Error handling and recovery
- ✅ Session persistence
- ✅ Protected routes
- ✅ Empty states
- ✅ Edge cases

## Current Status

**Note**: All test scenarios are currently **commented out** and ready for implementation in the next iteration. Each test includes:
- Clear description of what it tests
- Step-by-step implementation hints
- Realistic API mocking patterns
- Expected assertions and outcomes

To implement the tests:
1. Uncomment test scenarios one by one
2. Adjust assertions based on actual application behavior
3. Add any missing data-cy attributes discovered during implementation
4. Run tests and fix any failures

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
