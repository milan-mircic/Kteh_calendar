CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT,               -- NULL for Google-only accounts
  google_id     TEXT UNIQUE,        -- NULL for password-only accounts
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  date_of_birth TEXT,               -- ISO date
  purpose       TEXT,               -- "What are you going to be using the app for?"
  avatar_url    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activities (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  location    TEXT,
  start_at    TEXT NOT NULL,        -- ISO datetime
  end_at      TEXT NOT NULL,        -- ISO datetime
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_activities_user_start ON activities(user_id, start_at);
