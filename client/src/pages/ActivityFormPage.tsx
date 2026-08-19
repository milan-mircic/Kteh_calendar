import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import TopBar from '../components/TopBar';
import BackButton from '../components/BackButton';
import IconButton from '../components/IconButton';
import Input from '../components/Input';
import SaveIcon from '../components/SaveIcon';
import { api, ApiError } from '../api';
import type { Activity } from '../types';
import { toDateKey } from '../lib/calendar';
import { formatOrdinalDate } from '../lib/date';
import styles from './ActivityFormPage.module.css';

function combineDateTime(dateKey: string, time: string): string {
  return new Date(`${dateKey}T${time}`).toISOString();
}

function splitDateTime(iso: string): { dateKey: string; time: string } {
  const date = new Date(iso);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return { dateKey: toDateKey(date), time };
}

// Figma: 35:1389 — routes "/activity/new", "/activity/:id/edit". The day cell
// a "+" was clicked from sets ?date=; editing keeps the activity's own date
// (there's no date field in the design — only start/end time).
export default function ActivityFormPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [dateKey, setDateKey] = useState(() => searchParams.get('date') ?? toDateKey(new Date()));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    api
      .get<Activity>(`/api/activities/${id}`)
      .then((activity) => {
        if (cancelled) return;
        setTitle(activity.title);
        setDescription(activity.description ?? '');
        setLocation(activity.location ?? '');
        const start = splitDateTime(activity.startAt);
        const end = splitDateTime(activity.endAt);
        setDateKey(start.dateKey);
        setStartTime(start.time);
        setEndTime(end.time);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load activity');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        title,
        description: description || undefined,
        location: location || undefined,
        startAt: combineDateTime(dateKey, startTime),
        endAt: combineDateTime(dateKey, endTime),
      };
      const activity =
        isEditing && id
          ? await api.patch<Activity>(`/api/activities/${id}`, payload)
          : await api.post<Activity>('/api/activities', payload);
      navigate(`/activity/${activity.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/home.png" />
      <TopBar />

      {!loading && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.headingRow}>
            <h1 className={styles.heading}>{formatOrdinalDate(`${dateKey}T00:00:00`)}</h1>
            <IconButton type="submit" className={styles.save} disabled={saving} aria-label="Save activity">
              <SaveIcon />
            </IconButton>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.row}>
            <Input
              id="title"
              label="Activity title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input id="location" label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Activity description
            </label>
            <textarea
              id="description"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Time duration</span>
            <div className={styles.times}>
              <Input
                id="startTime"
                label="Start"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input
                id="endTime"
                label="End"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </form>
      )}

      <BackButton className={styles.back} aria-label="Cancel" />
    </div>
  );
}
