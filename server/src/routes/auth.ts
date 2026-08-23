import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { setAuthCookie, clearAuthCookie } from '../lib/auth';
import { createUser, getUserByEmail, getUserById, toPublicUser, updateUser } from '../lib/users';
import { googleAuthEnabled, passport } from '../lib/googleAuth';
import { sendPasswordResetEmail } from '../lib/email';
import { consumePasswordReset, createPasswordReset, getValidPasswordReset } from '../lib/passwordResets';

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

authRouter.get('/google', (req, res, next) => {
  if (!googleAuthEnabled) {
    res.status(501).json({ error: 'Google sign-in is not configured' });
    return;
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

authRouter.get('/google/callback', (req, res, next) => {
  if (!googleAuthEnabled) {
    res.status(501).json({ error: 'Google sign-in is not configured' });
    return;
  }
  passport.authenticate(
    'google',
    { session: false },
    (err: Error | null, user?: Express.User) => {
      if (err || !user) {
        console.error('[google callback] auth failed:', err);
        res.redirect(`${process.env.CLIENT_URL}/login`);
        return;
      }
      setAuthCookie(res, { userId: user.id });
      res.redirect(`${process.env.CLIENT_URL}/home`);
    },
  )(req, res, next);
});

const forgotPasswordSchema = z.object({ email: z.string().email() });

authRouter.post('/forgot-password', async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
    return;
  }

  const user = getUserByEmail(parsed.data.email);
  if (user) {
    const token = createPasswordReset(user.id);
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }
  res.status(204).end();
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

authRouter.post('/reset-password', async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
    return;
  }

  const userId = getValidPasswordReset(parsed.data.token);
  if (!userId) {
    res.status(400).json({ error: 'This reset link is invalid or has expired' });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  updateUser(userId, { passwordHash });
  consumePasswordReset(parsed.data.token);
  res.status(204).end();
});
