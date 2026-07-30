import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

export const accountRouter = Router();

accountRouter.use(authMiddleware);

// Person 2 (Phase 5)
accountRouter.patch('/', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

accountRouter.post('/avatar', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
