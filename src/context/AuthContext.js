import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createAPIClient } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [tokens, setTokensState] = useState(() => {
    try {
      const raw = localStorage.getItem('auth_tokens');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const setTokens = useCallback(t => {
    setTokensState(t);
    if (t) {
      localStorage.setItem('auth_tokens', JSON.stringify(t));
    } else {
      localStorage.removeItem('auth_tokens');
    }
  }, []);

  const api = createAPIClient(() => tokens, setTokens);

  const login = async (email, password) => {
    const resp = await api.login(email, password);
    setTokens({
      accessToken: resp.data.access_token,
      refreshToken: resp.data.refresh_token,
      expiresAt: resp.data.expires_at,
    });
    setUser({ id: resp.data.user_id, email: resp.data.email });
    return resp;
  };

  const register = async (email, password) => {
    const resp = await api.register(email, password);
    setTokens({
      accessToken: resp.data.access_token,
      refreshToken: resp.data.refresh_token,
      expiresAt: resp.data.expires_at,
    });
    setUser({ id: resp.data.user_id, email: resp.data.email });
    return resp;
  };

  const logout = async () => {
    if (tokens?.refreshToken) {
      try {
        await api.logout(tokens.refreshToken);
      } catch (e) {
        // Best effort - don't fail logout if backend is down
      }
    }
    setTokens(null);
    setUser(null);
  };

  useEffect(() => {
    const load = async () => {
      if (!tokens) {
        setUser(null);
        return;
      }
      setLoadingUser(true);
      try {
        const resp = await api.me();
        setUser(resp.data);
      } catch {
        logout();
      } finally {
        setLoadingUser(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.accessToken]);

  return (
    <AuthContext.Provider value={{ api, tokens, user, register, login, logout, loadingUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
