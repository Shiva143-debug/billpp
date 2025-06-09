import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../services/apiService';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update localStorage when userId changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('userId');
      setIsAuthenticated(false);
    }
  }, [userId]);

  const login = useCallback(async (id) => {
    setUserId(id);

  }, []);

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(userData);
      return { success: true, message: 'User Account Created successfully' };
    } catch (err) {
      setError(err.response?.data?.message || 'Email already exists. Please use a different email address.');
      return { success: false, message: err.response?.data?.message || 'Email already exists. Please use a different email address.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUserId(null);
  };

  // Update password function
  const updatePassword = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.updatePassword(userData);
      return { success: true, message: 'Password updated successfully' };
    } catch (err) {
      setError(err.response?.data?.message || 'Please Enter Valid Email');
      return { success: false, message: err.response?.data?.message || 'Please Enter Valid Email' };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    userId,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;