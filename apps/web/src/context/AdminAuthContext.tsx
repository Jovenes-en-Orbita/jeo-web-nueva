'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { AdminUser } from '@jeo/shared';
import { adminLogin as apiLogin, adminGetMe } from '@/lib/api';

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('jeo_admin_token');
    if (!storedToken) {
      setIsLoading(false);
      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      return;
    }

    setToken(storedToken);
    adminGetMe(storedToken)
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem('jeo_admin_token');
        setToken(null);
        setUser(null);
        if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pathname, router]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin({ email, password: pass });
      localStorage.setItem('jeo_admin_token', response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jeo_admin_token');
    setToken(null);
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
