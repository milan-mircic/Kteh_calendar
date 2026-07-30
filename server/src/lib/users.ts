import { db } from './db';
import type { User } from '../types';

interface UserRow {
  id: string;
  email: string;
  password_hash: string | null;
  google_id: string | null;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  purpose: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface NewUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  purpose?: string;
}

export function getUserByEmail(email: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
}

export function getUserById(id: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
}

export function createUser(input: NewUser): UserRow {
  db.prepare(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, date_of_birth, purpose)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    input.id,
    input.email,
    input.passwordHash,
    input.firstName,
    input.lastName,
    input.dateOfBirth ?? null,
    input.purpose ?? null,
  );
  return getUserById(input.id)!;
}

// Never send password_hash to the client.
export function toPublicUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    purpose: row.purpose,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}
