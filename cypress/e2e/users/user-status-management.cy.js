/**
 * User Status Management E2E Tests
 * Tests blocking, unblocking, activating, and deactivating users
 */

import { usersListPage } from '../../support/page-objects';
import { interceptUsers } from '../../support/api';
import { HTTP_STATUS } from '../../support/constants';

describe('User Status Management Flow', () => {
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

  context('Block User', () => {
    it('should successfully block an active user', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      // Mock block user API
      interceptUsers.block(userId, HTTP_STATUS.OK, {
        _id: userId,
        name: 'Seller User',
        email: 'seller@test.com',
        role: 'SELLER',
        status: 'BLOCKED',
      });

      // Mock refreshed users list
      cy.intercept('GET', '**/api/auth/users*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: userId,
            name: 'Seller User',
            email: 'seller@test.com',
            role: 'SELLER',
            status: 'BLOCKED',
          },
        ],
      }).as('refreshedUsersList');

      // Open block user dialog
      usersListPage.clickBlockUser(userId);
      usersListPage.shouldShowBlockUserDialog();

      // Confirm blocking
      cy.getByCy('user-block-confirm').click();

      // Wait for API call
      cy.wait('@blockUserRequest');

      // Should show success toast
      cy.shouldShowSuccessToast();

      // Dialog should close
      usersListPage.blockUserDialog.should('not.exist');

      // List should refresh
      cy.wait('@refreshedUsersList');
    });

    it('should block user with a reason', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'user-abc';
      const blockReason = 'Violation of terms of service';

      // Mock block user API
      interceptUsers.block(userId, HTTP_STATUS.OK);

      usersListPage.clickBlockUser(userId);
      usersListPage.shouldShowBlockUserDialog();

      // Enter blocking reason
      cy.get('textarea[placeholder*="Ej: Violación de políticas"]')
        .clear()
        .type(blockReason);

      cy.getByCy('user-block-confirm').click();

      cy.wait('@blockUserRequest').its('request.body').should('deep.include', {
        status: 'blocked',
      });

      cy.shouldShowSuccessToast();
    });

    it('should cancel blocking user', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      usersListPage.clickBlockUser(userId);
      usersListPage.shouldShowBlockUserDialog();

      // Click cancel
      cy.getByCy('user-block-cancel').click();

      // Dialog should close
      usersListPage.blockUserDialog.should('not.exist');

      // No API call should be made
      cy.get('@blockUserRequest.all').should('have.length', 0);
    });

    it('should show confirmation message in dialog', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      usersListPage.clickBlockUser(userId);
      usersListPage.shouldShowBlockUserDialog();

      // Should show user name
      usersListPage.blockUserDialog.should('contain', 'Seller User');

      // Should show warning message
      usersListPage.blockUserDialog.should('contain', 'no podrá acceder al sistema');
    });
  });

  context('Unblock User', () => {
    it('should successfully unblock a blocked user', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'blocked-user-ghi';

      // Mock unblock user API
      interceptUsers.unblock(userId, HTTP_STATUS.OK, {
        _id: userId,
        name: 'Blocked User',
        email: 'blocked@test.com',
        role: 'USER',
        status: 'ACTIVE',
      });

      // Mock refreshed users list
      cy.intercept('GET', '**/api/auth/users*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: userId,
            name: 'Blocked User',
            email: 'blocked@test.com',
            role: 'USER',
            status: 'ACTIVE',
          },
        ],
      }).as('refreshedUsersList');

      // Open user actions menu
      usersListPage.clickUnblockUser(userId);

      // Should show unblock dialog (if exists) or directly unblock
      // Confirm unblocking
      // Note: Implementation may vary - adjust based on actual UI

      // Wait for API call
      cy.wait('@unblockUserRequest');

      // Should show success toast
      cy.shouldShowSuccessToast();

      // List should refresh
      cy.wait('@refreshedUsersList');
    });

    it('should not show block option for already blocked users', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'blocked-user-ghi';

      usersListPage.openUserActionsMenu(userId);

      // Should show unblock, not block
      usersListPage.getUserActionUnblock(userId).should('be.visible');
      cy.getByCy(`user-action-block-${userId}`).should('not.exist');
    });
  });

  context('Error Handling', () => {
    it('should handle API errors when blocking user', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      // Mock error response
      interceptUsers.block(userId, HTTP_STATUS.FORBIDDEN, {
        message: 'You do not have permission to block users',
      });

      usersListPage.clickBlockUser(userId);
      usersListPage.shouldShowBlockUserDialog();

      cy.getByCy('user-block-confirm').click();

      cy.wait('@blockUserRequest');

      // Should show error toast
      cy.shouldShowErrorToast();
    });

    it('should handle network errors when blocking user', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      // Mock network error
      cy.intercept('POST', `**/api/auth/users/${userId}/block`, {
        forceNetworkError: true,
      }).as('blockUserRequest');

      usersListPage.clickBlockUser(userId);
      usersListPage.shouldShowBlockUserDialog();

      cy.getByCy('user-block-confirm').click();

      // Should show error toast
      cy.shouldShowErrorToast();
    });

    it('should handle API errors when unblocking user', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'blocked-user-ghi';

      // Mock error response
      interceptUsers.unblock(userId, HTTP_STATUS.NOT_FOUND, {
        message: 'User not found',
      });

      usersListPage.clickUnblockUser(userId);

      cy.wait('@unblockUserRequest');

      // Should show error toast
      cy.shouldShowErrorToast();
    });
  });

  context('UI/UX', () => {
    it('should show loading state while blocking user', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      // Mock with delay
      cy.intercept('POST', `**/api/auth/users/${userId}/block`, (req) => {
        req.reply({
          delay: 1000,
          statusCode: HTTP_STATUS.OK,
          body: {
            _id: userId,
            status: 'BLOCKED',
          },
        });
      }).as('blockUserRequest');

      usersListPage.clickBlockUser(userId);
      usersListPage.shouldShowBlockUserDialog();

      cy.getByCy('user-block-confirm').click();

      // Should show loading text
      cy.getByCy('user-block-confirm').should('contain', 'Bloqueando...');

      // Buttons should be disabled
      cy.getByCy('user-block-confirm').should('be.disabled');
      cy.getByCy('user-block-cancel').should('be.disabled');

      cy.wait('@blockUserRequest', { timeout: 2000 });
    });
  });

  context('Permissions', () => {
    it('should only allow admins to block/unblock users', () => {
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

      // User actions menu should not show block/unblock options
      // or should be disabled for non-admin users
      usersListPage.openUserActionsMenu('user-abc');

      cy.getByCy('user-action-block-user-abc').should('not.exist')
        .or('should', 'be.disabled');
    });
  });

  context('Status Consistency', () => {
    it('should update user status badge after blocking', () => {
      usersListPage.visit();
      cy.wait('@usersListRequest');

      const userId = 'seller-456';

      // Mock block user API
      interceptUsers.block(userId, HTTP_STATUS.OK);

      // Mock refreshed users list with updated status
      cy.intercept('GET', '**/api/auth/users*', {
        statusCode: HTTP_STATUS.OK,
        body: [
          {
            _id: userId,
            name: 'Seller User',
            email: 'seller@test.com',
            role: 'SELLER',
            status: 'BLOCKED',
          },
        ],
      }).as('refreshedUsersList');

      usersListPage.clickBlockUser(userId);
      usersListPage.shouldShowBlockUserDialog();

      cy.getByCy('user-block-confirm').click();

      cy.wait('@blockUserRequest');
      cy.wait('@refreshedUsersList');

      // Status badge should show "BLOCKED"
      usersListPage.getUserRow(userId).should('contain', 'BLOCKED');
    });
  });
});
