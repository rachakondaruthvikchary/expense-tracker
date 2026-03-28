import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

/**
 * Auth Context Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    console.log('🔐 AuthContext: Checking for existing user session');
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      console.log('✅ AuthContext: User found:', storedUser.email);
      setUser(storedUser);
    } else {
      console.log('ℹ️ AuthContext: No user found, starting fresh');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext: Logging in user:', email);
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      console.log('✅ AuthContext: Login successful for', email);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      console.error('❌ AuthContext: Login error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, confirmPassword) => {
    try {
      console.log('👤 AuthContext: Signing up user:', email, 'name:', name);
      setLoading(true);
      setError(null);
      const response = await authService.signup(name, email, password, confirmPassword);
      console.log('✅ AuthContext: Signup successful for', email);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      console.error('❌ AuthContext: Signup error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🔓 AuthContext: Logging out user');
    authService.logout();
    setUser(null);
    setError(null);
    console.log('✅ AuthContext: Logout successful');
  };

  const updateProfile = async (name, monthlyBudget, currency, theme) => {
    try {
      console.log('👤 AuthContext: Updating profile - name:', name, 'budget:', monthlyBudget);
      setError(null);
      const response = await authService.updateProfile(name, monthlyBudget, currency, theme);
      console.log('✅ AuthContext: Profile updated successfully');
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Profile update failed';
      console.error('❌ AuthContext: Profile update error:', errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
