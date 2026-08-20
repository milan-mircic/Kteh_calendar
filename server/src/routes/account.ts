import bcrypt from 'bcrypt';
import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { avatarUpload } from '../lib/avatarUpload';
import { getUserByEmail, toPublicUser, updateUser } from '../lib/users';

export const accountRouter = Router();

accountRouter.use(authMiddleware);

const updateAccountSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    purpose: z.string().optional(),
    dateOfBirth: z.string().optional(),
    newPassword: z.string().min(8).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

accountRouter.patch('/', async (req, res) => {
  const parsed = updateAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
    return;
  }

  const { newPassword, ...rest } = parsed.data;

  if (rest.email) {
    const existing = getUserByEmail(rest.email);
    if (existing && existing.id !== req.user!.id) {
      res.status(409).json({ error: 'An account with that email already exists' });
      return;
    }
  }

  const passwordHash = newPassword ? await bcrypt.hash(newPassword, 12) : undefined;
  const user = updateUser(req.user!.id, { ...rest, passwordHash });
  if (!user) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }
  res.json(toPublicUser(user));
});

accountRouter.post('/avatar', (req, res) => {
  avatarUpload.single('avatar')(req, res, (err: unknown) => {
    if (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid file' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    const user = updateUser(req.user!.id, { avatarUrl: `/uploads/${req.file.filename}` });
    if (!user) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    res.json(toPublicUser(user));
  });
});
