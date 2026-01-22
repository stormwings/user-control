/**
 * User Detail Page Object
 * Encapsulates interactions with the user detail page
 */

import { TEST_IDS } from '../utils/selectors';

class UserDetailPage {
  // ==================== GETTERS ====================

  // Page container
  get container() {
    return cy.getByCy(TEST_IDS.USERS.USER_DETAIL_PAGE);
  }

  // Header elements
  get backButton() {
    return cy.getByCy(TEST_IDS.USERS.USER_DETAIL_BACK_BUTTON);
  }

  get editButton() {
    return cy.getByCy(TEST_IDS.USERS.USER_DETAIL_EDIT_BUTTON);
  }

  get deleteButton() {
    return cy.getByCy(TEST_IDS.USERS.USER_DETAIL_DELETE_BUTTON);
  }

  // Detail card elements
  get detailCard() {
    return cy.getByCy(TEST_IDS.USERS.USER_DETAIL_CARD);
  }

  get nameElement() {
    return cy.getByCy(TEST_IDS.USERS.USER_DETAIL_NAME);
  }

  get emailElement() {
    return cy.getByCy(TEST_IDS.USERS.USER_DETAIL_EMAIL);
  }

  get roleElement() {
    return cy.getByCy(TEST_IDS.USERS.USER_DETAIL_ROLE);
  }

  get statusElement() {
    return cy.getByCy(TEST_IDS.USERS.USER_DETAIL_STATUS);
  }

  // Dialogs
  get changeRoleDialog() {
    return cy.getByCy(TEST_IDS.USERS.USER_CHANGE_ROLE_DIALOG);
  }

  get blockUserDialog() {
    return cy.getByCy(TEST_IDS.USERS.USER_BLOCK_DIALOG);
  }

  get deleteDialog() {
    return cy.getByCy(TEST_IDS.USERS.USER_DELETE_DIALOG);
  }

  // ==================== ACTIONS ====================

  /**
   * Visit user detail page
   * @param {string} userId - User ID
   * @returns {UserDetailPage} this
   */
  visit(userId) {
    cy.visit(`/dashboard/users/${userId}`);
    return this;
  }

  /**
   * Click back button
   * @returns {UserDetailPage} this
   */
  clickBack() {
    this.backButton.click();
    return this;
  }

  /**
   * Click edit button
   * @returns {UserDetailPage} this
   */
  clickEdit() {
    this.editButton.click();
    return this;
  }

  /**
   * Click delete button
   * @returns {UserDetailPage} this
   */
  clickDelete() {
    this.deleteButton.click();
    return this;
  }

  // ==================== ASSERTIONS ====================

  /**
   * Assert page is visible
   * @returns {UserDetailPage} this
   */
  shouldBeVisible() {
    this.container.should('be.visible');
    return this;
  }

  /**
   * Assert user name is displayed
   * @param {string} name - Expected name
   * @returns {UserDetailPage} this
   */
  shouldShowUserName(name) {
    this.nameElement.should('contain', name);
    return this;
  }

  /**
   * Assert user email is displayed
   * @param {string} email - Expected email
   * @returns {UserDetailPage} this
   */
  shouldShowUserEmail(email) {
    this.emailElement.should('contain', email);
    return this;
  }

  /**
   * Assert user role is displayed
   * @param {string} role - Expected role
   * @returns {UserDetailPage} this
   */
  shouldShowUserRole(role) {
    this.roleElement.should('contain', role);
    return this;
  }

  /**
   * Assert user status is displayed
   * @param {string} status - Expected status
   * @returns {UserDetailPage} this
   */
  shouldShowUserStatus(status) {
    this.statusElement.should('contain', status);
    return this;
  }

  /**
   * Assert we're at a specific user detail page
   * @param {string} userId - User ID
   * @returns {UserDetailPage} this
   */
  shouldBeAtUrl(userId) {
    cy.url().should('include', `/dashboard/users/${userId}`);
    return this;
  }

  /**
   * Assert change role dialog is visible
   * @returns {UserDetailPage} this
   */
  shouldShowChangeRoleDialog() {
    this.changeRoleDialog.should('be.visible');
    return this;
  }

  /**
   * Assert block user dialog is visible
   * @returns {UserDetailPage} this
   */
  shouldShowBlockUserDialog() {
    this.blockUserDialog.should('be.visible');
    return this;
  }

  /**
   * Assert delete dialog is visible
   * @returns {UserDetailPage} this
   */
  shouldShowDeleteDialog() {
    this.deleteDialog.should('be.visible');
    return this;
  }
}

export default UserDetailPage;
