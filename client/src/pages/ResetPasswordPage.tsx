import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import BackButton from '../components/BackButton';
import Input from '../components/Input';
import Button from '../components/Button';
import { api, ApiError } from '../api';
import styles from './ResetPasswordPage.module.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { token, newPassword });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/forgot-password.png" />
      <BackButton to="/login" className={styles.back} />
      <h1 className={styles.heading}>Reset your password</h1>

      {!token ? (
        <p className={styles.error}>
          This link is missing its reset token. Request a new one from the{' '}
          <Link to="/forgot-password">forgot password</Link> page.
        </p>
      ) : done ? (
        <p className={styles.helper}>
          Your password has been reset. You can now <Link to="/login">log in</Link>.
        </p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            size="large"
            type="password"
            placeholder="new password"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            size="large"
            type="password"
            placeholder="confirm new password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Resetting…' : 'Reset password'}
          </Button>
        </form>
      )}
    </div>
  );
}
