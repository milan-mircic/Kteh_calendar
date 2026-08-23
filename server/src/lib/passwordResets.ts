import { randomUUID } from 'crypto';
import { db } from './db';

const TOKEN_LIFETIME_MS = 60 * 60 * 1000; // mozda menjati vreme

interface PasswordResetRow {
  token: string;
  user_id: string;
  expires_at: string;
  used_at: string | null;
}

export function createPasswordReset(userId: string): string {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString();
  db.prepare('INSERT INTO password_resets (token, user_id, expires_at) VALUES (?, ?, ?)').run(
    token,
    userId,
    expiresAt,
  );
  return token;
}

// Returns the associated userId only if the token exists, hasn't been used,
// and hasn't expired — the three ways a reset link can go stale.
export function getValidPasswordReset(token: string): string | null {
  const row = db.prepare('SELECT * FROM password_resets WHERE token = ?').get(token) as
    | PasswordResetRow
    | undefined;
  if (!row || row.used_at || new Date(row.expires_at) < new Date()) return null;
  return row.user_id;
}

export function consumePasswordReset(token: string): void {
  db.prepare("UPDATE password_resets SET used_at = datetime('now') WHERE token = ?").run(token);
}
