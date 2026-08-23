import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import OpeningPage from './pages/OpeningPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import ActivityFormPage from './pages/ActivityFormPage';
import AccountPage from './pages/AccountPage';
import AccountEditPage from './pages/AccountEditPage';
import AccountAvatarPage from './pages/AccountAvatarPage';

// Definisane putanje do stranica


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<OpeningPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/activity/new" element={<ActivityFormPage />} />
              <Route path="/activity/:id" element={<ActivityDetailPage />} />
              <Route path="/activity/:id/edit" element={<ActivityFormPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/edit" element={<AccountEditPage />} />
              <Route path="/account/avatar" element={<AccountAvatarPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
