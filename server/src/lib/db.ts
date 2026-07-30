import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';

export const db = new Database(process.env.DATABASE_FILE || './data/app.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(readFileSync(path.join(__dirname, '../schema.sql'), 'utf8'));
