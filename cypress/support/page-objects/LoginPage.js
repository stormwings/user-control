/**
 * LoginPage - Page Object Model
 * Encapsulates login page selectors and actions
 */
import { TEST_IDS } from '../utils/selectors';

class LoginPage {
  // Selectors using data-cy attributes
  get emailInput() {
    return cy.getByCy(TEST_IDS.AUTH.LOGIN_EMAIL_INPUT);
  }

  get passwordInput() {
    return cy.getByCy(TEST_IDS.AUTH.LOGIN_PASSWORD_INPUT);
  }

  get submitButton() {
    return cy.getByCy(TEST_IDS.AUTH.LOGIN_SUBMIT_BUTTON);
  }

  get loginForm() {
    return cy.getByCy(TEST_IDS.AUTH.LOGIN_FORM);
  }

  get loginPage() {
    return cy.getByCy(TEST_IDS.AUTH.LOGIN_PAGE);
  }

  get backToHomeLink() {
    return cy.getByCy(TEST_IDS.AUTH.LOGIN_BACK_HOME_LINK);
  }

  // Fallback selectors for elements without data-cy yet
  get pageTitle() {
    return cy.contains('User Control');
  }

  get emailLabel() {
    return cy.contains('label', 'Correo');
  }

  get passwordLabel() {
    return cy.contains('label', 'Contraseña');
  }

  // Actions
  visit() {
    cy.visit('/login');
    return this;
  }

  fillEmail(email) {
    this.emailInput.clear().type(email);
    return this;
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password);
    return this;
  }

  submit() {
    this.submitButton.click();
    return this;
  }

  login(email, password) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
    return this;
  }

  // Assertions
  shouldBeVisible() {
    this.pageTitle.should('be.visible');
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.submitButton.should('be.visible');
    return this;
  }

  shouldShowLoadingState() {
    this.submitButton.should('contain', 'Ingresando...').should('be.disabled');
    return this;
  }

  shouldShowNormalState() {
    this.submitButton.should('contain', 'Ingresar').should('not.be.disabled');
    return this;
  }

  shouldHaveInvalidEmail() {
    this.emailInput.should('have.attr', 'type', 'email');
    cy.get('input[name="email"]:invalid').should('exist');
    return this;
  }

  shouldHaveValidFormStructure() {
    this.emailInput
      .should('have.attr', 'type', 'email')
      .should('have.attr', 'placeholder', 'tu@email.com')
      .should('have.attr', 'required');

    this.passwordInput
      .should('have.attr', 'type', 'password')
      .should('have.attr', 'placeholder', '••••••••')
      .should('have.attr', 'required');

    this.emailLabel.should('be.visible');
    this.passwordLabel.should('be.visible');
    this.backToHomeLink.should('have.attr', 'href', '/');

    return this;
  }
}

export default LoginPage;
