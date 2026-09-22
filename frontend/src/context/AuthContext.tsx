'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '@/services';
import type { AuthResponse, LoginRequest, RegistoRequest, Role } from '@/types';

interface AuthUser {
  id: number;
  nomeCompleto: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  ready: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  registar: (data: RegistoRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'movitur_token';
const USER_KEY = 'movitur_user';

function loadUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
    setUser(loadUser());
    setReady(true);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);
    const authUser: AuthUser = {
      id: response.id,
      nomeCompleto: response.nomeCompleto,
      email: response.email,
      role: response.role,
    };
    saveSession(response.token, authUser);
    setToken(response.token);
    setUser(authUser);
    return response;
  }, []);

  const registar = useCallback(async (data: RegistoRequest) => {
    await authService.registar(data);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    ready,
    login,
    registar,
    logout,
  }), [user, token, ready, login, registar, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
