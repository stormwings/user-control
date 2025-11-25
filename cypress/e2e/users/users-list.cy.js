/**
 * Users List E2E Tests
 * Tests the user list, search, and filter functionality
 */

import { usersListPage, dashboardPage } from '../../support/page-objects';
import { interceptAuth, interceptUsers } from '../../support/api';
import { ROUTES, HTTP_STATUS } from '../../support/constants';

describe('Users List Flow', () => {
  beforeEach(() => {
    // Login as admin
    cy.fixture('users').then((users) => {
      cy.setAuthState({
        data: {
          user: users.adminUser,
          token: 'fake-token',
        },
      });
    });

    // Mock users list API
    interceptUsers.list();
  });

  context('Users List Page UI', () => {
    it('should display users list with all elements', () => {
      usersListPage.visit();

      cy.wait('@usersListRequest');

      usersListPage.shouldBeVisible();
      usersListPage.createUserButton.should('be.visible');
      usersListPage.searchInput.should('be.visible');
      usersListPage.table.should('be.visible');
    });

    it('should display all users from the API', () => {
      usersListPage.visit();

      cy.wait('@usersListRequest');

      // Should have 7 users from fixture
      usersListPage.shouldHaveUserCount(7);

      // Verify specific users exist
      usersListPage.shouldHaveUserRow('admin-123');
      usersListPage.shouldHaveUserRow('seller-456');
      usersListPage.shouldHaveUserRow('viewer-789');
    });
  });

  context('Search Functionality', () => {
    it('should search for users by name', () => {
      // Mock filtered response
      cy.intercept('GET', '**/api/auth/users?*search=Admin*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: 'admin-123',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'ADMIN',
            status: 'ACTIVE',
          },
        ],
      }).as('searchRequest');

      usersListPage.visit();
      cy.wait('@usersListRequest');

      // Search for "Admin"
      usersListPage.search('Admin');

      // Wait for debounce and API call
      cy.wait('@searchRequest', { timeout: 3000 });

      // Should only show admin user
      usersListPage.shouldHaveUserCount(1);
      usersListPage.shouldHaveUserRow('admin-123');
    });

    it('should search for users by email', () => {
      // Mock filtered response
      cy.intercept('GET', '**/api/auth/users?*search=seller*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: 'seller-456',
            name: 'Seller User',
            email: 'seller@test.com',
            role: 'SELLER',
            status: 'ACTIVE',
          },
        ],
      }).as('searchRequest');

      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.search('seller');

      cy.wait('@searchRequest', { timeout: 3000 });

      usersListPage.shouldHaveUserCount(1);
      usersListPage.shouldHaveUserRow('seller-456');
    });

    it('should show empty state when no users match search', () => {
      // Mock empty response
      cy.intercept('GET', '**/api/auth/users?*search=nonexistent*', {
        statusCode: HTTP_STATUS.OK,
        body: [],
      }).as('searchRequest');

      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.search('nonexistent');

      cy.wait('@searchRequest', { timeout: 3000 });

      usersListPage.shouldHaveUserCount(0);
    });
  });

  context('Filter Functionality', () => {
    it('should filter users by active status', () => {
      // Mock filtered response
      cy.intercept('GET', '**/api/auth/users?*status=ACTIVE*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: 'admin-123',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'ADMIN',
            status: 'ACTIVE',
          },
          {
            _id: 'seller-456',
            name: 'Seller User',
            email: 'seller@test.com',
            role: 'SELLER',
            status: 'ACTIVE',
          },
        ],
      }).as('filterRequest');

      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.filterByActiveStatus();

      cy.wait('@filterRequest');

      // Should show only active users
      usersListPage.shouldHaveUserCount(2);
      usersListPage.shouldHaveUserRow('admin-123');
      usersListPage.shouldHaveUserRow('seller-456');
    });

    it('should filter users by inactive status', () => {
      // Mock filtered response
      cy.intercept('GET', '**/api/auth/users?*status=INACTIVE*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: 'inactive-user-def',
            name: 'Inactive User',
            email: 'inactive@test.com',
            role: 'USER',
            status: 'INACTIVE',
          },
        ],
      }).as('filterRequest');

      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.filterByInactiveStatus();

      cy.wait('@filterRequest');

      usersListPage.shouldHaveUserCount(1);
      usersListPage.shouldHaveUserRow('inactive-user-def');
    });

    it('should filter users by admin role', () => {
      // Mock filtered response
      cy.intercept('GET', '**/api/auth/users?*role=ADMIN*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: 'admin-123',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'ADMIN',
            status: 'ACTIVE',
          },
        ],
      }).as('filterRequest');

      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.filterByAdminRole();

      cy.wait('@filterRequest');

      usersListPage.shouldHaveUserCount(1);
      usersListPage.shouldHaveUserRow('admin-123');
    });

    it('should filter users by user role', () => {
      // Mock filtered response
      cy.intercept('GET', '**/api/auth/users?*role=USER*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: 'user-abc',
            name: 'Regular User',
            email: 'user@test.com',
            role: 'USER',
            status: 'ACTIVE',
          },
        ],
      }).as('filterRequest');

      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.filterByUserRole();

      cy.wait('@filterRequest');

      usersListPage.shouldHaveUserCount(1);
      usersListPage.shouldHaveUserRow('user-abc');
    });

    it('should combine multiple filters', () => {
      // Mock combined filter response
      cy.intercept('GET', '**/api/auth/users?*status=ACTIVE*role=ADMIN*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: 'admin-123',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'ADMIN',
            status: 'ACTIVE',
          },
        ],
      }).as('filterRequest');

      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.filterByActiveStatus();
      usersListPage.filterByAdminRole();

      cy.wait('@filterRequest');

      usersListPage.shouldHaveUserCount(1);
      usersListPage.shouldHaveUserRow('admin-123');
    });

    it('should clear all filters', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      // Apply filters
      usersListPage.filterByActiveStatus();

      // Clear filters
      interceptUsers.list();
      usersListPage.clearFilters();

      cy.wait('@usersListRequest');

      // Should show all users again
      usersListPage.shouldHaveUserCount(7);
    });
  });

  context('Navigation', () => {
    it('should navigate to user detail when clicking row', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      // Mock user detail
      interceptUsers.detail('admin-123');

      usersListPage.clickUserRow('admin-123');

      cy.url().should('include', '/dashboard/users/admin-123');
    });

    it('should navigate to create user page when clicking create button', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.clickCreateUser();

      cy.url().should('include', '/dashboard/users/new');
    });
  });

  context('User Actions Menu', () => {
    it('should open user actions menu', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.openUserActionsMenu('admin-123');

      usersListPage.getUserActionsMenu('admin-123').should('be.visible');
      usersListPage.getUserActionView('admin-123').should('be.visible');
      usersListPage.getUserActionChangeRole('admin-123').should('be.visible');
    });

    it('should navigate to user detail from actions menu', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      // Mock user detail
      interceptUsers.detail('seller-456');

      usersListPage.clickViewUser('seller-456');

      cy.url().should('include', '/dashboard/users/seller-456');
    });

    it('should open change role dialog from actions menu', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.clickChangeRole('seller-456');

      usersListPage.shouldShowChangeRoleDialog();
    });

    it('should open block user dialog for active user', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.clickBlockUser('admin-123');

      usersListPage.shouldShowBlockUserDialog();
    });

    it('should show unblock option for blocked user', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      usersListPage.openUserActionsMenu('blocked-user-ghi');

      usersListPage.getUserActionUnblock('blocked-user-ghi').should('be.visible');
      usersListPage.getUserActionBlock('blocked-user-ghi').should('not.exist');
    });
  });

  context('Loading States', () => {
    it('should show loading state while fetching users', () => {
      // Intercept with delay
      cy.intercept('GET', '**/api/auth/users*', (req) => {
        req.reply({
          delay: 1000,
          statusCode: HTTP_STATUS.OK,
          fixture: 'api-responses/users-list.json',
        });
      }).as('usersListDelayed');

      usersListPage.visit();

      // Loading spinner should be visible
      usersListPage.table.should('be.visible');
      cy.contains('Cargando usuarios...').should('be.visible');

      cy.wait('@usersListDelayed', { timeout: 2000 });

      // Users should be displayed
      usersListPage.shouldHaveUserCount(7);
    });
  });

  context('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/auth/users*', {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        body: { message: 'Internal server error' },
      }).as('usersListError');

      usersListPage.visit();

      cy.wait('@usersListError');

      // Should show error toast
      cy.shouldShowErrorToast();
    });
  });
});
