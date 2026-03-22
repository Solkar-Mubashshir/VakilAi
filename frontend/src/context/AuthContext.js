import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('vk_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('vk_token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('vk_token');
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        setToken(null); setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token); setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password, language) => {
    const { data } = await api.post('/auth/register', { name, email, password, language });
    setToken(data.token); setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => { setToken(null); setUser(null); }, []);

  const updateLanguage = useCallback(async (language) => {
    const { data } = await api.put('/auth/language', { language });
    setUser(prev => ({ ...prev, language }));
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};