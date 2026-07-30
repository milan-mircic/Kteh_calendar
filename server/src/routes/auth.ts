import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { setAuthCookie, clearAuthCookie } from '../lib/auth';
import { createUser, getUserByEmail, getUserById, toPublicUser } from '../lib/users';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().optional(),
  purpose: z.string().optional(),
});

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
    return;
  }
  const { email, password, firstName, lastName, dateOfBirth, purpose } = parsed.data;

  if (getUserByEmail(email)) {
    res.status(409).json({ error: 'An account with that email already exists' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = createUser({
    id: randomUUID(),
    email,
    passwordHash,
    firstName,
    lastName,
    dateOfBirth,
    purpose,
  });

  setAuthCookie(res, { userId: user.id });
  res.status(201).json(toPublicUser(user));
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
    return;
  }
  const { email, password } = parsed.data;

  const user = getUserByEmail(email);
  if (!user || !user.password_hash) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  setAuthCookie(res, { userId: user.id });
  res.json(toPublicUser(user));
});

authRouter.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

authRouter.get('/me', authMiddleware, (req, res) => {
  const user = getUserById(req.user!.id);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json(toPublicUser(user));
});

// Person 2: Google OAuth (Phase 2)
authRouter.get('/google', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

authRouter.get('/google/callback', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Person 2: stub — log a reset link, no real email (out of scope)
authRouter.post('/forgot-password', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
