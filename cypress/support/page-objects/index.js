/**
 * Page Objects Index
 * Centralized export for all page objects
 */
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import RegisterPage from './RegisterPage';
import UsersListPage from './UsersListPage';
import UserDetailPage from './UserDetailPage';

// Export page object instances
export const loginPage = new LoginPage();
export const dashboardPage = new DashboardPage();
export const registerPage = new RegisterPage();
export const usersListPage = new UsersListPage();
export const userDetailPage = new UserDetailPage();

// Export classes for custom instantiation if needed
export { LoginPage, DashboardPage, RegisterPage, UsersListPage, UserDetailPage };
