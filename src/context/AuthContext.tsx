'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '@/lib/types';
import { AuthSession } from '@/lib/auth';
import { INITIAL_USERS } from '@/lib/seed-data';

interface AuthContextType {
  user: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: Role, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoUser: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage; no session means the user must sign in
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem('stitchflow_auth_user');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Auth initialization error', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password?: string, role?: Role) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('stitchflow_auth_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: message };
    }
  };

  const register = async (name: string, email: string, password: string, role: Role, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('stitchflow_auth_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout error', e);
    }
    setUser(null);
    localStorage.removeItem('stitchflow_auth_user');
    window.location.href = '/login';
  };

  const switchDemoUser = (role: Role) => {
    const target = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    const session: AuthSession = {
      userId: target.id,
      email: target.email,
      name: target.name,
      role: target.role,
      avatar: target.avatar,
    };
    setUser(session);
    localStorage.setItem('stitchflow_auth_user', JSON.stringify(session));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoUser,
      }}
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
