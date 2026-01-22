/**
 * Users List Page Object
 * Encapsulates interactions with the users list page
 */

import { TEST_IDS } from '../utils/selectors';

class UsersListPage {
  // ==================== GETTERS ====================

  // Page container
  get container() {
    return cy.getByCy(TEST_IDS.USERS.USERS_PAGE);
  }

  // Toolbar
  get createUserButton() {
    return cy.getByCy(TEST_IDS.USERS.USERS_CREATE_BUTTON);
  }

  // Search and filters
  get searchInput() {
    return cy.getByCy(TEST_IDS.USERS.USERS_SEARCH);
  }

  get filterStatusActive() {
    return cy.getByCy(`${TEST_IDS.USERS.USERS_FILTER_STATUS}-active`);
  }

  get filterStatusInactive() {
    return cy.getByCy(`${TEST_IDS.USERS.USERS_FILTER_STATUS}-inactive`);
  }

  get filterRoleAdmin() {
    return cy.getByCy(`${TEST_IDS.USERS.USERS_FILTER_ROLE}-admin`);
  }

  get filterRoleUser() {
    return cy.getByCy(`${TEST_IDS.USERS.USERS_FILTER_ROLE}-user`);
  }

  get filterClear() {
    return cy.getByCy(TEST_IDS.USERS.USERS_FILTER_CLEAR);
  }

  // Table
  get table() {
    return cy.getByCy(TEST_IDS.USERS.USERS_TABLE);
  }

  // Get specific user row by userId
  getUserRow(userId) {
    return cy.getByCy(`${TEST_IDS.USERS.USERS_TABLE_ROW}-${userId}`);
  }

  // Get user action menu
  getUserActionsMenu(userId) {
    return cy.getByCy(`user-actions-menu-${userId}`);
  }

  // User actions
  getUserActionView(userId) {
    return cy.getByCy(`user-action-view-${userId}`);
  }

  getUserActionChangeRole(userId) {
    return cy.getByCy(`user-action-change-role-${userId}`);
  }

  getUserActionBlock(userId) {
    return cy.getByCy(`user-action-block-${userId}`);
  }

  getUserActionUnblock(userId) {
    return cy.getByCy(`user-action-unblock-${userId}`);
  }

  getUserActionResetPassword(userId) {
    return cy.getByCy(`user-action-reset-password-${userId}`);
  }

  // Dialogs
  get changeRoleDialog() {
    return cy.getByCy(TEST_IDS.USERS.USER_CHANGE_ROLE_DIALOG);
  }

  get blockUserDialog() {
    return cy.getByCy(TEST_IDS.USERS.USER_BLOCK_DIALOG);
  }

  // ==================== ACTIONS ====================

  /**
   * Visit the users list page
   * @returns {UsersListPage} this
   */
  visit() {
    cy.visit('/dashboard/users');
    return this;
  }

  /**
   * Search for users
   * @param {string} searchText - Text to search
   * @returns {UsersListPage} this
   */
  search(searchText) {
    this.searchInput.clear().type(searchText);
    return this;
  }

  /**
   * Clear search input
   * @returns {UsersListPage} this
   */
  clearSearch() {
    this.searchInput.clear();
    return this;
  }

  /**
   * Filter by active status
   * @returns {UsersListPage} this
   */
  filterByActiveStatus() {
    this.filterStatusActive.click();
    return this;
  }

  /**
   * Filter by inactive status
   * @returns {UsersListPage} this
   */
  filterByInactiveStatus() {
    this.filterStatusInactive.click();
    return this;
  }

  /**
   * Filter by admin role
   * @returns {UsersListPage} this
   */
  filterByAdminRole() {
    this.filterRoleAdmin.click();
    return this;
  }

  /**
   * Filter by user role
   * @returns {UsersListPage} this
   */
  filterByUserRole() {
    this.filterRoleUser.click();
    return this;
  }

  /**
   * Clear all filters
   * @returns {UsersListPage} this
   */
  clearFilters() {
    this.filterClear.click();
    return this;
  }

  /**
   * Click on create user button
   * @returns {UsersListPage} this
   */
  clickCreateUser() {
    this.createUserButton.click();
    return this;
  }

  /**
   * Click on a user row
   * @param {string} userId - User ID
   * @returns {UsersListPage} this
   */
  clickUserRow(userId) {
    this.getUserRow(userId).click();
    return this;
  }

  /**
   * Open user actions menu
   * @param {string} userId - User ID
   * @returns {UsersListPage} this
   */
  openUserActionsMenu(userId) {
    // Find the row and click the menu button
    this.getUserRow(userId).within(() => {
      cy.get('button[title="Más acciones"]').click();
    });
    return this;
  }

  /**
   * Click view user action
   * @param {string} userId - User ID
   * @returns {UsersListPage} this
   */
  clickViewUser(userId) {
    this.openUserActionsMenu(userId);
    this.getUserActionView(userId).click();
    return this;
  }

  /**
   * Click change role action
   * @param {string} userId - User ID
   * @returns {UsersListPage} this
   */
  clickChangeRole(userId) {
    this.openUserActionsMenu(userId);
    this.getUserActionChangeRole(userId).click();
    return this;
  }

  /**
   * Click block user action
   * @param {string} userId - User ID
   * @returns {UsersListPage} this
   */
  clickBlockUser(userId) {
    this.openUserActionsMenu(userId);
    this.getUserActionBlock(userId).click();
    return this;
  }

  /**
   * Click unblock user action
   * @param {string} userId - User ID
   * @returns {UsersListPage} this
   */
  clickUnblockUser(userId) {
    this.openUserActionsMenu(userId);
    this.getUserActionUnblock(userId).click();
    return this;
  }

  /**
   * Click reset password action
   * @param {string} userId - User ID
   * @returns {UsersListPage} this
   */
  clickResetPassword(userId) {
    this.openUserActionsMenu(userId);
    this.getUserActionResetPassword(userId).click();
    return this;
  }

  // ==================== ASSERTIONS ====================

  /**
   * Assert page is visible
   * @returns {UsersListPage} this
   */
  shouldBeVisible() {
    this.container.should('be.visible');
    this.table.should('be.visible');
    return this;
  }

  /**
   * Assert user row exists
   * @param {string} userId - User ID
   * @returns {UsersListPage} this
   */
  shouldHaveUserRow(userId) {
    this.getUserRow(userId).should('exist');
    return this;
  }

  /**
   * Assert user row does not exist
   * @param {string} userId - User ID
   * @returns {UsersListPage} this
   */
  shouldNotHaveUserRow(userId) {
    cy.getByCy(`${TEST_IDS.USERS.USERS_TABLE_ROW}-${userId}`).should('not.exist');
    return this;
  }

  /**
   * Assert table has specific number of rows
   * @param {number} count - Expected number of rows
   * @returns {UsersListPage} this
   */
  shouldHaveUserCount(count) {
    cy.get(`[data-cy^="${TEST_IDS.USERS.USERS_TABLE_ROW}"]`).should('have.length', count);
    return this;
  }

  /**
   * Assert change role dialog is visible
   * @returns {UsersListPage} this
   */
  shouldShowChangeRoleDialog() {
    this.changeRoleDialog.should('be.visible');
    return this;
  }

  /**
   * Assert block user dialog is visible
   * @returns {UsersListPage} this
   */
  shouldShowBlockUserDialog() {
    this.blockUserDialog.should('be.visible');
    return this;
  }

  /**
   * Assert we're at the users list page
   * @returns {UsersListPage} this
   */
  shouldBeAtUrl() {
    cy.url().should('include', '/dashboard/users');
    return this;
  }
}

export default UsersListPage;
