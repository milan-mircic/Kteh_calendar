import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import PageBackground from '../components/PageBackground';
import HomeButton from '../components/HomeButton';
import Button from '../components/Button';
import PersonIcon from '../components/PersonIcon';
import { api, ApiError } from '../api';
import { useAuth } from '../context/AuthContext';
import { resolveAvatarUrl } from '../lib/avatar';
import type { User } from '../types';
import styles from './AccountAvatarPage.module.css';

const ACCEPTED_TYPES = 'image/png,image/jpeg,image/gif,image/webp';

// Figma: 25:1141 — route "/account/avatar". "Upload a new one" opens the
// browser's native file-picker dialog; the upload starts as soon as a file
// is chosen, with no separate on-page form step.
export default function AccountAvatarPage() {
  const { user, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!user) return null;

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const updated = await api.postForm<User>('/api/account/avatar', formData);
      login(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  const currentImage = previewUrl ?? resolveAvatarUrl(user.avatarUrl);

  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/home.png" />
      <HomeButton className={styles.home} />
      <h1 className={styles.heading}>Change your profile picture</h1>

      <div className={styles.current}>
        <span className={styles.currentLabel}>Current:</span>
        <span className={styles.avatarPreview}>
          {currentImage ? <img src={currentImage} alt="" /> : <PersonIcon />}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className={styles.hiddenInput}
        onChange={handleFileChange}
        aria-hidden
        tabIndex={-1}
      />

      {error && <p className={styles.error}>{error}</p>}

      <Button
        type="button"
        className={styles.submit}
        disabled={saving}
        onClick={() => fileInputRef.current?.click()}
      >
        {saving ? 'Uploading…' : 'Upload a new one'}
      </Button>
    </div>
  );
}
