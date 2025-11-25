/**
 * Page Objects Index
 * Centralized export for all page objects
 */
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';

// Export page object instances
export const loginPage = new LoginPage();
export const dashboardPage = new DashboardPage();

// Export classes for custom instantiation if needed
export { LoginPage, DashboardPage };
