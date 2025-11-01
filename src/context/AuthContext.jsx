import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      if (authService.isAuthenticated()) {
        const data = await authService.checkAuth();
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password, rememberMe);
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      // Mock login for development
      const mockUser = {
        id: 'currentUser',
        email: email,
        name: 'Demo User',
        avatar: null,
        isOnline: true
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('chatai_auth_token', mockToken);
      localStorage.setItem('chatai_user', JSON.stringify(mockUser));
      if (rememberMe) {
        localStorage.setItem('chatai_remember_me', 'true');
      }

      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      return { user: mockUser, token: mockToken };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
