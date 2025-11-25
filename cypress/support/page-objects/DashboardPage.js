/**
 * DashboardPage - Page Object Model
 * Encapsulates dashboard page selectors and actions
 */
import { TEST_IDS } from '../utils/selectors';

class DashboardPage {
  // Selectors using data-cy attributes
  get dashboardContainer() {
    return cy.getByCy(TEST_IDS.LAYOUT.DASHBOARD_CONTAINER);
  }

  get mainContent() {
    return cy.getByCy(TEST_IDS.LAYOUT.DASHBOARD_MAIN_CONTENT);
  }

  get sidebar() {
    return cy.getByCy(TEST_IDS.LAYOUT.SIDEBAR);
  }

  get sidebarNav() {
    return cy.getByCy(TEST_IDS.LAYOUT.SIDEBAR_NAV);
  }

  get logoutButton() {
    return cy.getByCy(TEST_IDS.LAYOUT.SIDEBAR_LOGOUT_BUTTON);
  }

  // Actions
  visit() {
    cy.visit('/dashboard');
    return this;
  }

  // Assertions
  shouldBeVisible() {
    cy.url().should('include', '/dashboard');
    return this;
  }

  shouldBeAtUrl(path = '/dashboard') {
    cy.url().should('include', path);
    return this;
  }
}

export default DashboardPage;
