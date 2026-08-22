import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Nije vidljiva komponenta - sluzi da dobije potvrdu o tome da li je korisnik uspesno ulogovan, i, ako jeste, da dalje posalje korisnika na pocetnu stranicu
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />;
}
