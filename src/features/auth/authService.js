import httpRequest from '../../utils/api'

const register = async (user) => {
  try {
    const response = await httpRequest.post("/auth/register", user);
    return response.data;
  } catch (error) {
    console.error('Register service error:', error);
    throw error;
  }
}

const login = async (user) => {
  try {
    const response = await httpRequest.post("/auth/login", user);
    return response.data;
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
}

const logout = async () => {
  try {
    const response = await httpRequest.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error('Logout service error:', error);
    throw error;
  }
}

const allUsers = async () => {
  try {
    const response = await httpRequest.get("/auth/users");
    return response.data;
  } catch (error) {
    console.error('All users service error:', error);
    throw error;
  }
}

const authService = {
  register,
  login,
  logout,
  allUsers
}
export default authService