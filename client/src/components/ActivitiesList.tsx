import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../api';
import type { Activity } from '../types';
import { isSameDay, toMonthParam } from '../lib/calendar';
import { formatClock } from '../lib/date';
import styles from './ActivitiesList.module.css';

// Prikazivanje danasnjih akttivnosti

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
      <path
        d="M4 12h14m0 0-5-5m5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusSquareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden focusable="false">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}


export default function ActivitiesList() {
  const today = useMemo(() => new Date(), []);
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    api
      .get<Activity[]>(`/api/activities?month=${toMonthParam(today.getFullYear(), today.getMonth())}`)
      .then((data) => {
        if (!cancelled) setActivities(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load activities');
      });
    return () => {
      cancelled = true;
    };
  }, [today]);

  const todaysActivities = useMemo(
    () =>
      (activities ?? [])
        .filter((activity) => isSameDay(new Date(activity.startAt), today))
        .sort((a, b) => a.startAt.localeCompare(b.startAt)),
    [activities, today],
  );

  return (
    <div className={styles.list}>
      <h2 className={styles.heading}>Your activities</h2>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {activities !== null && !error && todaysActivities.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No activities, yet</p>
          <Link to="/activity/new" className={styles.addButton}>
            Add activity
            <PlusSquareIcon />
          </Link>
        </div>
      )}

      {todaysActivities.length > 0 && (
        <ul className={styles.rows}>
          {todaysActivities.map((activity, i) => (
            <li key={activity.id}>
              <Link
                to={`/activity/${activity.id}`}
                className={[styles.row, i % 2 === 1 && styles.rowAlt].filter(Boolean).join(' ')}
              >
                <span className={styles.time}>{formatClock(new Date(activity.startAt))}</span>
                <span className={styles.title}>{activity.title}</span>
                <span className={styles.arrow} aria-hidden>
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
