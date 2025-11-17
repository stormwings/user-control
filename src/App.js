import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Content from "./pages/Content";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/routing/PrivateRoute";

import UsersListPage from "./pages/users/UsersListPage";
import UserCreatePage from "./pages/users/UserCreatePage";
import UserDetailPage from "./pages/users/UserDetailPage";
import UserEditPage from "./pages/users/UserEditPage";

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            >
              <Route path="" element={<Content />} />

              <Route path="users" element={<UsersListPage />} />
              <Route path="users/new" element={<UserCreatePage />} />
              <Route path="users/:userId" element={<UserDetailPage />} />
              <Route path="users/:userId/edit" element={<UserEditPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
