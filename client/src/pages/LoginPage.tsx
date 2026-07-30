import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import Input from '../components/Input';
import Button from '../components/Button';
import { api, ApiError } from '../api';
import type { User } from '../types';
import styles from './LoginPage.module.css';

// Figma: 2:4 — route "/login"
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post<User>('/api/auth/login', { email, password });
      navigate('/home');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/login.png" />
      <Link to="/" className={styles.back} aria-label="Back">
        ‹
      </Link>
      <h1 className={styles.heading}>Log in</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          size="large"
          type="email"
          placeholder="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          size="large"
          type="password"
          placeholder="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
        <Link to="/forgot-password" className={styles.forgot}>
          Forgot your password?
        </Link>
      </form>
    </div>
  );
}
