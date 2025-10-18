import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const STORAGE_KEY = 'hns_auth_state';

const defaultAuthState = {
  isAuthenticated: false,
  user: null,
  token: null
};

const AuthContext = createContext({
  ...defaultAuthState,
  login: async (credentials) => {},
  logout: () => {},
  refreshUser: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultAuthState;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
      return defaultAuthState;
    } catch {
      return defaultAuthState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login with credentials:', credentials);
      const response = await authService.login(credentials);
      console.log('🔐 Login response:', response);
      
      if (response.success) {
        const newState = {
          isAuthenticated: true,
          user: response.data.user,
          token: response.data.token
        };
        
        console.log('🔄 Setting new auth state:', newState);
        setState(newState);

        // Store token in localStorage for API calls
        localStorage.setItem('hns_auth_token', response.data.token);

        console.log('✅ Login successful, user:', response.data.user);
        return response;
      } else {
        console.error('❌ Login failed - response:', response);
        const errorMessage = response.error || response.message || 'Login failed';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setState(defaultAuthState);
    localStorage.removeItem('hns_auth_token');
    localStorage.removeItem(STORAGE_KEY);
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('hns_auth_token');
      if (token) {
        const response = await authService.getCurrentUser();
        if (response.success) {
          setState({
            isAuthenticated: true,
            user: response.data.user,
            token: token
          });
        } else {
          // Token invalid, logout
          logout();
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      logout();
    }
  };

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    refreshUser
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);




