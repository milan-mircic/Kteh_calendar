import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

// Owned by Person 2 (Phase 2): loads /api/auth/me on mount, exposes user + login/logout.
interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User | null>(null);
  const [loading] = useState(false);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
