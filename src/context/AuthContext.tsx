'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthSession } from '@/lib/auth';

interface AuthContextType {
  user: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({}));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // The session lives in an httpOnly cookie; the server is the source of truth.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.success && data.user) setUser(data.user);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login: AuthContextType['login'] = async (email, password) => {
    try {
      const data = await postJson('/api/auth/login', { email, password });
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register: AuthContextType['register'] = async (name, email, password, phone) => {
    try {
      const data = await postJson('/api/auth/register', { name, email, password, phone });
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout error', e);
    }
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
