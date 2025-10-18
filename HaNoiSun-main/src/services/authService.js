import { api } from './api';

// Auth Service - API calls for authentication
export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const { email, password } = credentials;
      console.log('🔐 AuthService: Making login request with:', { email, password: '***' });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('🔐 AuthService: Raw API response:', response);

      // Store token in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('hns_auth_token', response.data.token);
        localStorage.setItem('hns_user', JSON.stringify(response.data.user));
        console.log('🔐 AuthService: Token and user data stored');
      }

      return response;
    } catch (error) {
      console.error('❌ AuthService: Error during login:', error);
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('authToken');
  }
};

export default authService;
