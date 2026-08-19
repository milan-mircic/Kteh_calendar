import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Person 2 (Phase 2): guards routes that require a signed-in user, redirecting
// to the opening screen otherwise. Waits for the initial /api/auth/me check
// before deciding, so a signed-in user isn't bounced on page reload.
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />;
}
