import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, ApiError } from '../api';
import type { User } from '../types';

// Sluzi da obradi i sacuva informaciju da li je login uspesan ili ne
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<User>('/api/auth/me')
      .then(setUser)
      .catch((err) => {
        if (!(err instanceof ApiError) || err.status !== 401) {
          console.error('Failed to load session', err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  }

  return <AuthContext.Provider value={{ user, loading, login: setUser, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
