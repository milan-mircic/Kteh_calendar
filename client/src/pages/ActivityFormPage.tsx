import { useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import HomeButton from '../components/HomeButton';
import IconButton from '../components/IconButton';
import Input from '../components/Input';
import SaveIcon from '../components/SaveIcon';
import { api, ApiError } from '../api';
import type { Activity } from '../types';
import { toDateKey } from '../lib/calendar';
import { formatOrdinalDate } from '../lib/date';
import styles from './ActivityFormPage.module.css';


// Od linije 17 do 69 sav kod se bavi procesuiranjem unesenog vremena.

function combineDateTime(dateKey: string, time: string): string {
  return new Date(`${dateKey}T${time}`).toISOString();
}

function splitDateTime(iso: string): { dateKey: string; time: string } {
  const date = new Date(iso);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return { dateKey: toDateKey(date), time };
}

const TIME_PATTERN = /^([01]?\d|2[0-3]):([0-5]\d)$/;

function normalizeTime(value: string): string | null {
  const match = TIME_PATTERN.exec(value.trim());
  if (!match) return null;
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

function timeDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4);
}

function formatTimeDigits(digits: string): string {
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function handleTimeKeyDown(value: string, setValue: (next: string) => void) {
  return (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      setValue(formatTimeDigits(timeDigits(value).slice(0, -1)));
      return;
    }

    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      setValue(formatTimeDigits((timeDigits(value) + e.key).slice(0, 4)));
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
    }
  };
}

function handleTimeChange(setValue: (next: string) => void) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    setValue(formatTimeDigits(timeDigits(e.target.value)));
  };
}

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

    const normalizedStart = normalizeTime(startTime);
    const normalizedEnd = normalizeTime(endTime);
    if (!normalizedStart || !normalizedEnd) {
      setError('Enter times as HH:MM (24-hour), e.g. 14:30');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        description: description || undefined,
        location: location || undefined,
        startAt: combineDateTime(dateKey, normalizedStart),
        endAt: combineDateTime(dateKey, normalizedEnd),
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
      <HomeButton className={styles.home} />

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
                type="text"
                inputMode="numeric"
                placeholder="HH:MM"
                pattern="([01]?\d|2[0-3]):[0-5]\d"
                title="Enter time as HH:MM, e.g. 14:30"
                maxLength={5}
                autoComplete="off"
                required
                value={startTime}
                onKeyDown={handleTimeKeyDown(startTime, setStartTime)}
                onChange={handleTimeChange(setStartTime)}
              />
              <Input
                id="endTime"
                label="End"
                type="text"
                inputMode="numeric"
                placeholder="HH:MM"
                pattern="([01]?\d|2[0-3]):[0-5]\d"
                title="Enter time as HH:MM, e.g. 14:30"
                maxLength={5}
                autoComplete="off"
                required
                value={endTime}
                onKeyDown={handleTimeKeyDown(endTime, setEndTime)}
                onChange={handleTimeChange(setEndTime)}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
