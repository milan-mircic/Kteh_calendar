import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import Input from '../components/Input';
import Button from '../components/Button';
import { api, ApiError } from '../api';
import type { User } from '../types';
import styles from './RegisterPage.module.css';

// Figma: 7:174 — route "/register"
export default function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [purpose, setPurpose] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!acceptedTerms) {
      setError('You must accept the terms and agreements');
      return;
    }

    setLoading(true);
    try {
      await api.post<User>('/api/auth/register', {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth: dateOfBirth || undefined,
        purpose: purpose || undefined,
      });
      navigate('/home');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/register.png" />
      <Link to="/" className={styles.back} aria-label="Back">
        ‹
      </Link>
      <h1 className={styles.heading}>Create an account</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          id="firstName"
          label="First name:"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          id="lastName"
          label="Last name:"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          id="email"
          label="Email:"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          label="Password:"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          id="confirmPassword"
          label="Confirm Password:"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <label htmlFor="purpose">What are you going to be using the app for?</label>
        <select
          id="purpose"
          className={styles.select}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="">Choose</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="other">Other</option>
        </select>
        <Input
          id="dateOfBirth"
          label="Date of birth:"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <label className={styles.terms}>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          I accept terms and agreements{' '}
          <span className={styles.termsLink}>Terms and agreements</span>
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}
