import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';
import PersonIcon from '../components/PersonIcon';
import { api, ApiError } from '../api';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';
import styles from './AccountAvatarPage.module.css';

// Figma: 25:1141 — route "/account/avatar". The API only accepts an avatar
// URL for now (§4: "set avatar (URL to start)"), so this is a URL field
// rather than a real file upload.
export default function AccountAvatarPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await api.post<User>('/api/account/avatar', { avatarUrl });
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
      <h1 className={styles.heading}>Change your profile picture</h1>

      <div className={styles.current}>
        <span className={styles.currentLabel}>Current:</span>
        <span className={styles.avatarPreview}>
          {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <PersonIcon />}
        </span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Image URL"
          type="url"
          placeholder="https://…"
          required
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" className={styles.submit} disabled={saving}>
          {saving ? 'Uploading…' : 'Upload a new one'}
        </Button>
      </form>
    </div>
  );
}
