import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success) setUser(response.data.data);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data?.token;
      const userData = response.data?.data;
      if (token) {
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'No token received from server' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  const signup = async (username, email, password, niche) => {
    try {
      const response = await api.post('/auth/signup', {
        username,
        email,
        password,
        niche,
      });
      const token = response.data?.token;
      const userData = response.data?.data;
      if (token) {
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'No token received from server' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Signup failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
