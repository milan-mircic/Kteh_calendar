import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

export const authRouter = Router();

// Person 1: email/password auth (Phase 2)
authRouter.post('/register', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

authRouter.post('/login', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

authRouter.post('/logout', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

authRouter.get('/me', authMiddleware, (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
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
