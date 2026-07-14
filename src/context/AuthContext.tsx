import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { api } from '@/lib/api';
import type { User } from '@/types/user';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshUser() {
    try {
      const response = await api.get(
        '/auth/me',
      );

      setUser(response.data);
    } catch {
      setUser(null);
    }
  }

  function logout() {
  localStorage.removeItem('token');
  setUser(null);
  window.location.replace('/login');
}

  useEffect(() => {
    refreshUser().finally(() =>
      setLoading(false),
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}