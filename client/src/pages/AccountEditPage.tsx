import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import BackButton from '../components/BackButton';
import IconButton from '../components/IconButton';
import Input from '../components/Input';
import SaveIcon from '../components/SaveIcon';
import { api, ApiError } from '../api';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';
import styles from './AccountEditPage.module.css';

// Figma: 22:1520 — route "/account/edit". No date field on the activity form
// but this screen does have one, matching the Register screen's date input.
export default function AccountEditPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [purpose, setPurpose] = useState(user?.purpose ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const updated = await api.patch<User>('/api/account', {
        firstName,
        lastName,
        email,
        purpose: purpose || undefined,
        dateOfBirth: dateOfBirth || undefined,
        newPassword: newPassword || undefined,
      });
      login(updated);
      navigate('/account');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/home.png" />
      <BackButton to="/account" className={styles.back} />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.headingRow}>
          <h1 className={styles.heading}>Edit account</h1>
          <IconButton type="submit" className={styles.save} disabled={saving} aria-label="Save account">
            <SaveIcon />
          </IconButton>
        </div>

        {error && <p className={styles.error}>{error}</p>}

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
          id="newPassword"
          label="New Password:"
          type="password"
          autoComplete="new-password"
          placeholder="Leave blank to keep current password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          id="confirmNewPassword"
          label="Confirm New Password:"
          type="password"
          autoComplete="new-password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />

        <div className={styles.field}>
          <label htmlFor="purpose" className={styles.label}>
            What are you going to be using the app for?
          </label>
          <select id="purpose" className={styles.select} value={purpose ?? ''} onChange={(e) => setPurpose(e.target.value)}>
            <option value="">Choose</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="other">Other</option>
          </select>
        </div>

        <Input
          id="dateOfBirth"
          label="Date of birth:"
          type="date"
          value={dateOfBirth ?? ''}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </form>
    </div>
  );
}
