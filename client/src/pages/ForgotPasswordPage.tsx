import { useState, type FormEvent } from 'react';
import PageBackground from '../components/PageBackground';
import BackButton from '../components/BackButton';
import Input from '../components/Input';
import Button from '../components/Button';
import { api, ApiError } from '../api';
import styles from './ForgotPasswordPage.module.css';

// Figma: 7:169 — route "/forgot-password"
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSubmitted(true);
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
      <h1 className={styles.heading}>Resetting the password</h1>

      {submitted ? (
        <p className={styles.helper}>
          If that email is registered, a reset link is on its way — check your inbox.
        </p>
      ) : (
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
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Submitting…' : 'Submit'}
          </Button>
          <p className={styles.helper}>
            After entering your email, you will receive a link to reset your password
          </p>
        </form>
      )}
    </div>
  );
}
