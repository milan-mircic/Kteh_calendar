import { db } from './db';
import type { Activity } from '../types';

interface ActivityRow {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_at: string;
  end_at: string;
  user_id: string;
  created_at: string;
}

export function toPublicActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    startAt: row.start_at,
    endAt: row.end_at,
    userId: row.user_id,
    createdAt: row.created_at,
  };
}

// `month` is "YYYY-MM". ISO datetimes sort lexicographically, so a plain
// string range comparison is enough to bucket by month.
export function listActivitiesForMonth(userId: string, month: string): ActivityRow[] {
  const [yearStr, monthStr] = month.split('-');
  const year = Number(yearStr);
  const monthNum = Number(monthStr);
  const nextYear = monthNum === 12 ? year + 1 : year;
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;

  const rangeStart = `${yearStr}-${monthStr}-01`;
  const rangeEnd = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

  return db
    .prepare(
      `SELECT * FROM activities
       WHERE user_id = ? AND start_at >= ? AND start_at < ?
       ORDER BY start_at`,
    )
    .all(userId, rangeStart, rangeEnd) as ActivityRow[];
}

export function getActivityById(userId: string, id: string): ActivityRow | undefined {
  return db
    .prepare('SELECT * FROM activities WHERE id = ? AND user_id = ?')
    .get(id, userId) as ActivityRow | undefined;
}

export interface NewActivity {
  id: string;
  userId: string;
  title: string;
  description?: string;
  location?: string;
  startAt: string;
  endAt: string;
}

export function createActivity(input: NewActivity): ActivityRow {
  db.prepare(
    `INSERT INTO activities (id, title, description, location, start_at, end_at, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    input.id,
    input.title,
    input.description ?? null,
    input.location ?? null,
    input.startAt,
    input.endAt,
    input.userId,
  );
  return getActivityById(input.userId, input.id)!;
}

export interface ActivityPatch {
  title?: string;
  description?: string;
  location?: string;
  startAt?: string;
  endAt?: string;
}

// Returns undefined when the activity doesn't exist (or belongs to another
// user) so the route can respond 404 without a separate existence check.
export function updateActivity(userId: string, id: string, patch: ActivityPatch): ActivityRow | undefined {
  const existing = getActivityById(userId, id);
  if (!existing) return undefined;

  db.prepare(
    `UPDATE activities SET title = ?, description = ?, location = ?, start_at = ?, end_at = ?
     WHERE id = ? AND user_id = ?`,
  ).run(
    patch.title ?? existing.title,
    patch.description ?? existing.description,
    patch.location ?? existing.location,
    patch.startAt ?? existing.start_at,
    patch.endAt ?? existing.end_at,
    id,
    userId,
  );
  return getActivityById(userId, id);
}

export function deleteActivity(userId: string, id: string): boolean {
  const result = db.prepare('DELETE FROM activities WHERE id = ? AND user_id = ?').run(id, userId);
  return result.changes > 0;
}
