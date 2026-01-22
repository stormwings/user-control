/**
 * Register Page Object
 * Encapsulates interactions with the registration page
 */

import { TEST_IDS } from '../utils/selectors';

class RegisterPage {
  // ==================== GETTERS ====================

  // Page container
  get registerPage() {
    return cy.getByCy(TEST_IDS.AUTH.REGISTER_PAGE);
  }

  // Form
  get registerForm() {
    return cy.getByCy(TEST_IDS.AUTH.REGISTER_FORM);
  }

  get nameInput() {
    return cy.getByCy(TEST_IDS.AUTH.REGISTER_NAME_INPUT);
  }

  get emailInput() {
    return cy.getByCy(TEST_IDS.AUTH.REGISTER_EMAIL_INPUT);
  }

  get passwordInput() {
    return cy.getByCy(TEST_IDS.AUTH.REGISTER_PASSWORD_INPUT);
  }

  get submitButton() {
    return cy.getByCy(TEST_IDS.AUTH.REGISTER_SUBMIT_BUTTON);
  }

  get backHomeLink() {
    return cy.getByCy(TEST_IDS.AUTH.REGISTER_BACK_HOME_LINK);
  }

  // ==================== ACTIONS ====================

  /**
   * Visit the register page
   * @returns {RegisterPage} this
   */
  visit() {
    cy.visit('/register');
    return this;
  }

  /**
   * Fill name field
   * @param {string} name - Name to enter
   * @returns {RegisterPage} this
   */
  fillName(name) {
    this.nameInput.clear().type(name);
    return this;
  }

  /**
   * Fill email field
   * @param {string} email - Email to enter
   * @returns {RegisterPage} this
   */
  fillEmail(email) {
    this.emailInput.clear().type(email);
    return this;
  }

  /**
   * Fill password field
   * @param {string} password - Password to enter
   * @returns {RegisterPage} this
   */
  fillPassword(password) {
    this.passwordInput.clear().type(password);
    return this;
  }

  /**
   * Submit the form
   * @returns {RegisterPage} this
   */
  submit() {
    this.submitButton.click();
    return this;
  }

  /**
   * Complete registration flow
   * @param {string} name - Name
   * @param {string} email - Email
   * @param {string} password - Password
   * @returns {RegisterPage} this
   */
  register(name, email, password) {
    this.fillName(name);
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
    return this;
  }

  // ==================== ASSERTIONS ====================

  /**
   * Assert page is visible
   * @returns {RegisterPage} this
   */
  shouldBeVisible() {
    this.registerPage.should('be.visible');
    this.registerForm.should('be.visible');
    return this;
  }

  /**
   * Assert form has valid structure
   * @returns {RegisterPage} this
   */
  shouldHaveValidFormStructure() {
    this.nameInput.should('be.visible');
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.submitButton.should('be.visible');
    return this;
  }

  /**
   * Assert email field has invalid state
   * @returns {RegisterPage} this
   */
  shouldHaveInvalidEmail() {
    this.emailInput.should('have.attr', 'type', 'email');
    return this;
  }

  /**
   * Assert we're at register page
   * @returns {RegisterPage} this
   */
  shouldBeAtUrl() {
    cy.url().should('include', '/register');
    return this;
  }
}

export default RegisterPage;
