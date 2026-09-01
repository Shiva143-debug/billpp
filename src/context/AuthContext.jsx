import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../services/apiService';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Brief splash so the app feels polished on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Login - stores the JWT token and user info returned by the backend
  const login = useCallback(async (loginResponse) => {
    if (!loginResponse?.token) {
      return { success: false, message: 'Invalid login response' };
    }
    setToken(loginResponse.token);
    setUser(loginResponse.user || null);
    localStorage.setItem('token', loginResponse.token);
    if (loginResponse.user) {
      localStorage.setItem('user', JSON.stringify(loginResponse.user));
    } else {
      localStorage.removeItem('user');
    }
    return { success: true, message: 'Login successful' };
  }, []);

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    const response = await authAPI.register(userData);
    if (response.success) {
      setLoading(false);
      return { success: true, message: response.message || 'User Account Created successfully' };
    }
    setError(response.message || 'Email already exists. Please use a different email address.');
    setLoading(false);
    return { success: false, message: response.message || 'Email already exists. Please use a different email address.' };
  };

  // Logout function
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Update password function
  const updatePassword = async (userData) => {
    setLoading(true);
    setError(null);

    const response = await authAPI.updatePassword(userData);
    if (response.success) {
      setLoading(false);
      return { success: true, message: response.message || 'Password updated successfully' };
    }
    setError(response.message || 'Please Enter Valid Email');
    setLoading(false);
    return { success: false, message: response.message || 'Please Enter Valid Email' };
  };

  // Context value
  const value = {
    token,
    user,
    userId: user?.id || null,
    isAuthenticated: !!token,
    loading,
    isAppLoading,
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
