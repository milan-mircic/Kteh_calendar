import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import Button from '../components/Button';
import { api, ApiError } from '../api';
import type { Activity } from '../types';
import { formatOrdinalDate, formatTimeRange } from '../lib/date';
import styles from './ActivityDetailPage.module.css';

// Figma: 37:1309 — route "/activity/:id"
export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setActivity(null);
    api
      .get<Activity>(`/api/activities/${id}`)
      .then((data) => {
        if (!cancelled) setActivity(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load activity');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleDelete() {
    if (!id || !window.confirm('Delete this activity?')) return;
    setDeleting(true);
    setError(null);
    try {
      await api.delete(`/api/activities/${id}`);
      navigate('/home');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete activity');
      setDeleting(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/home.png" />

      {activity && <h1 className={styles.heading}>{formatOrdinalDate(activity.startAt)}</h1>}

      {error && <p className={styles.error}>{error}</p>}

      {activity && (
        <div className={styles.card}>
          <div className={styles.titleRow}>
            <span>{activity.title}</span>
            <span>{formatTimeRange(activity.startAt, activity.endAt)}</span>
          </div>

          {activity.location && (
            <div className={styles.location}>
              <span aria-hidden>📍</span>
              <span>{activity.location}</span>
            </div>
          )}

          {activity.description && <p className={styles.description}>{activity.description}</p>}

          <div className={styles.actions}>
            <Link to={`/activity/${activity.id}/edit`}>
              <Button type="button">Edit</Button>
            </Link>
            <Button type="button" className={styles.deleteButton} onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </div>
      )}

      <Link to="/home" className={styles.back} aria-label="Back">
        ‹
      </Link>
    </div>
  );
}
