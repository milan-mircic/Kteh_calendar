import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../api';
import type { Activity } from '../types';
import { getMonthGrid, isSameDay, toDateKey, toMonthParam, WEEKDAY_LABELS } from '../lib/calendar';
import styles from './Calendar.module.css';

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long' });
const MAX_VISIBLE_ACTIVITIES = 2;

// Figma: Home — calendar section (30:1239)
export default function Calendar() {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    api
      .get<Activity[]>(`/api/activities?month=${toMonthParam(year, month)}`)
      .then((data) => {
        if (!cancelled) setActivities(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load activities');
      });
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const activitiesByDay = useMemo(() => {
    const map = new Map<string, Activity[]>();
    for (const activity of activities) {
      const key = toDateKey(new Date(activity.startAt));
      const existing = map.get(key) ?? [];
      existing.push(activity);
      map.set(key, existing);
    }
    return map;
  }, [activities]);

  const days = useMemo(() => getMonthGrid(year, month), [year, month]);

  function goToPreviousMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className={styles.title}>
          {MONTH_FORMATTER.format(new Date(year, month))}, {year}
        </h2>
        <button type="button" className={styles.navButton} onClick={goToNextMonth} aria-label="Next month">
          ›
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className={styles.weekday}>
            {label}
          </span>
        ))}
      </div>

      <div className={styles.grid}>
        {days.map(({ date, isCurrentMonth }, i) => {
          const dateKey = toDateKey(date);
          const dayActivities = activitiesByDay.get(dateKey) ?? [];
          const rowIndex = Math.floor(i / 7);
          const cellClassName = [
            styles.cell,
            rowIndex % 2 === 1 && styles.cellAlt,
            !isCurrentMonth && styles.cellDimmed,
            isSameDay(date, today) && styles.today,
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={dateKey} className={cellClassName}>
              <span className={styles.dateNumber}>{date.getDate()}</span>
              <Link
                to={`/activity/new?date=${dateKey}`}
                className={styles.addButton}
                aria-label={`Add activity on ${dateKey}`}
              >
                +
              </Link>
              <ul className={styles.activities}>
                {dayActivities.slice(0, MAX_VISIBLE_ACTIVITIES).map((activity) => (
                  <li key={activity.id}>
                    <Link to={`/activity/${activity.id}`} className={styles.activity}>
                      {activity.title}
                    </Link>
                  </li>
                ))}
                {dayActivities.length > MAX_VISIBLE_ACTIVITIES && (
                  <li className={styles.more}>+{dayActivities.length - MAX_VISIBLE_ACTIVITIES} more</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
