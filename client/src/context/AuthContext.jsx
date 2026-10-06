import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'usr_admin_1',
    name: 'Praneeth Sharma',
    email: 'admin@moveai.com',
    role: 'Fleet Director',
    company: 'MoveAI Urban Logistics'
  });
  const [token, setToken] = useState('demo-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('moveai_token');
    if (savedToken) {
      setToken(savedToken);
      api.getMe().then(res => {
        if (res && res.success && res.user) {
          setUser(res.user);
        }
      });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const res = await api.login(email, password);
    setLoading(false);
    if (res && res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('moveai_token', res.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    const res = await api.register(name, email, password, role);
    setLoading(false);
    if (res && res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('moveai_token', res.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('moveai_token');
  };

  const demoLogin = (role = 'Fleet Director') => {
    const demoUser = {
      id: 'usr_demo_admin',
      name: role === 'Fleet Director' ? 'Praneeth Sharma (Admin)' : 'Priya Nair (Commuter)',
      email: role === 'Fleet Director' ? 'director@moveai.com' : 'commuter@moveai.com',
      role: role,
      company: 'MoveAI Smart Logistics Hub'
    };
    setUser(demoUser);
    setToken('demo-token-active');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
