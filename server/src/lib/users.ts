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

export function getUserByGoogleId(googleId: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId) as UserRow | undefined;
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

export interface NewGoogleUser {
  id: string;
  email: string;
  googleId: string;
  firstName: string;
  lastName: string;
}

//Hash za sifru ostaje nula - google korisnik
export function createGoogleUser(input: NewGoogleUser): UserRow {
  db.prepare(
    `INSERT INTO users (id, email, google_id, first_name, last_name)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(input.id, input.email, input.googleId, input.firstName, input.lastName);
  return getUserById(input.id)!;
}

// Sprecava logovanje dva naloga sa istim mejlom nezavisno od toga da li je koriscen google sso ili je rucno kreiran korisnik
export function linkGoogleAccount(userId: string, googleId: string): void {
  db.prepare('UPDATE users SET google_id = ? WHERE id = ?').run(googleId, userId);
}

export interface UserPatch {
  firstName?: string;
  lastName?: string;
  email?: string;
  purpose?: string;
  dateOfBirth?: string;
  passwordHash?: string;
  avatarUrl?: string;
}

export function updateUser(id: string, patch: UserPatch): UserRow | undefined {
  const existing = getUserById(id);
  if (!existing) return undefined;

  db.prepare(
    `UPDATE users SET first_name = ?, last_name = ?, email = ?, purpose = ?, date_of_birth = ?, password_hash = ?, avatar_url = ?
     WHERE id = ?`,
  ).run(
    patch.firstName ?? existing.first_name,
    patch.lastName ?? existing.last_name,
    patch.email ?? existing.email,
    patch.purpose ?? existing.purpose,
    patch.dateOfBirth ?? existing.date_of_birth,
    patch.passwordHash ?? existing.password_hash,
    patch.avatarUrl ?? existing.avatar_url,
    id,
  );
  return getUserById(id);
}

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
