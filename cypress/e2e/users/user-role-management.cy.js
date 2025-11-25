/**
 * User Role Management E2E Tests
 * Tests the role change functionality for users
 */

import { usersListPage } from '../../support/page-objects';
import { interceptUsers } from '../../support/api';
import { HTTP_STATUS } from '../../support/constants';

describe('User Role Management Flow', () => {
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

  context('Change User Role', () => {
    it('should successfully change user role from SELLER to ADMIN', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      // Mock role change API
      interceptUsers.changeRole(userId, HTTP_STATUS.OK, {
        _id: userId,
        name: 'Seller User',
        email: 'seller@test.com',
        role: 'ADMIN',
        isAdmin: true,
        status: 'ACTIVE',
      });

      // Mock refreshed users list
      cy.intercept('GET', '**/api/auth/users*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: userId,
            name: 'Seller User',
            email: 'seller@test.com',
            role: 'ADMIN',
            isAdmin: true,
            status: 'ACTIVE',
          },
        ],
      }).as('refreshedUsersList');

      // Open change role dialog
      usersListPage.clickChangeRole(userId);
      usersListPage.shouldShowChangeRoleDialog();

      // Select new role (ADMIN)
      cy.getByCy('user-form-role-select').select('ADMIN');

      // Confirm change
      cy.getByCy('user-change-role-confirm').click();

      // Wait for API call
      cy.wait('@changeRoleRequest');

      // Should show success toast
      cy.shouldShowSuccessToast();

      // Dialog should close
      usersListPage.changeRoleDialog.should('not.exist');

      // List should refresh
      cy.wait('@refreshedUsersList');
    });

    it('should successfully change user role from USER to SELLER', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'user-abc';

      // Mock role change API
      interceptUsers.changeRole(userId, HTTP_STATUS.OK, {
        _id: userId,
        name: 'Regular User',
        email: 'user@test.com',
        role: 'SELLER',
        isAdmin: false,
        status: 'ACTIVE',
      });

      usersListPage.clickChangeRole(userId);
      usersListPage.shouldShowChangeRoleDialog();

      cy.getByCy('user-form-role-select').select('SELLER');
      cy.getByCy('user-change-role-confirm').click();

      cy.wait('@changeRoleRequest');
      cy.shouldShowSuccessToast();
    });

    it('should successfully change user role to VIEWER', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'user-abc';

      // Mock role change API
      interceptUsers.changeRole(userId, HTTP_STATUS.OK, {
        _id: userId,
        name: 'Regular User',
        email: 'user@test.com',
        role: 'VIEWER',
        isAdmin: false,
        status: 'ACTIVE',
      });

      usersListPage.clickChangeRole(userId);
      usersListPage.shouldShowChangeRoleDialog();

      cy.getByCy('user-form-role-select').select('VIEWER');
      cy.getByCy('user-change-role-confirm').click();

      cy.wait('@changeRoleRequest');
      cy.shouldShowSuccessToast();
    });

    it('should cancel role change', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      usersListPage.clickChangeRole(userId);
      usersListPage.shouldShowChangeRoleDialog();

      // Click cancel
      cy.getByCy('user-change-role-cancel').click();

      // Dialog should close
      usersListPage.changeRoleDialog.should('not.exist');

      // No API call should be made
      cy.get('@changeRoleRequest.all').should('have.length', 0);
    });

    it('should disable confirm button when no role is selected', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      usersListPage.clickChangeRole(userId);
      usersListPage.shouldShowChangeRoleDialog();

      // Clear selection if any
      cy.getByCy('user-form-role-select').select('');

      // Confirm button should be disabled
      cy.getByCy('user-change-role-confirm').should('be.disabled');
    });
  });

  context('Role Change Permissions', () => {
    it('should only allow admins to change roles', () => {
      // Login as non-admin user (seller)
      cy.fixture('users').then((users) => {
        cy.setAuthState({
          data: {
            user: users.sellerUser,
            token: 'fake-token',
          },
        });
      });

      usersListPage.visit();
      cy.wait('@usersListRequest');

      // User actions menu should not show change role option
      // or should be disabled for non-admin users
      usersListPage.openUserActionsMenu('user-abc');

      // Either the option doesn't exist or clicking it shows permission error
      cy.getByCy('user-action-change-role-user-abc').should('not.exist')
        .or('should', 'be.disabled');
    });
  });

  context('Error Handling', () => {
    it('should handle API errors when changing role', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      // Mock error response
      interceptUsers.changeRole(userId, HTTP_STATUS.FORBIDDEN, {
        message: 'You do not have permission to change user roles',
      });

      usersListPage.clickChangeRole(userId);
      usersListPage.shouldShowChangeRoleDialog();

      cy.getByCy('user-form-role-select').select('ADMIN');
      cy.getByCy('user-change-role-confirm').click();

      cy.wait('@changeRoleRequest');

      // Should show error toast
      cy.shouldShowErrorToast();

      // Dialog may or may not close depending on implementation
    });

    it('should handle network errors when changing role', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      // Mock network error
      cy.intercept('PATCH', `**/api/auth/users/${userId}/role`, {
        forceNetworkError: true,
      }).as('changeRoleRequest');

      usersListPage.clickChangeRole(userId);
      usersListPage.shouldShowChangeRoleDialog();

      cy.getByCy('user-form-role-select').select('ADMIN');
      cy.getByCy('user-change-role-confirm').click();

      // Should show error toast
      cy.shouldShowErrorToast();
    });
  });

  context('UI/UX', () => {
    it('should show loading state while changing role', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      // Mock with delay
      cy.intercept('PATCH', `**/api/auth/users/${userId}/role`, (req) => {
        req.reply({
          delay: 1000,
          statusCode: HTTP_STATUS.OK,
          body: {
            _id: userId,
            role: 'ADMIN',
          },
        });
      }).as('changeRoleRequest');

      usersListPage.clickChangeRole(userId);
      usersListPage.shouldShowChangeRoleDialog();

      cy.getByCy('user-form-role-select').select('ADMIN');
      cy.getByCy('user-change-role-confirm').click();

      // Should show loading text
      cy.getByCy('user-change-role-confirm').should('contain', 'Cambiando...');

      // Buttons should be disabled
      cy.getByCy('user-change-role-confirm').should('be.disabled');
      cy.getByCy('user-change-role-cancel').should('be.disabled');

      cy.wait('@changeRoleRequest', { timeout: 2000 });
    });

    it('should display current role in the dialog', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      usersListPage.clickChangeRole(userId);
      usersListPage.shouldShowChangeRoleDialog();

      // Current role should be selected
      cy.getByCy('user-form-role-select').should('have.value', 'SELLER');

      // Dialog should show user name
      usersListPage.changeRoleDialog.should('contain', 'Seller User');
    });
  });
});
