import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

export const activitiesRouter = Router();

activitiesRouter.use(authMiddleware);

// Person 1 (Phase 3)
activitiesRouter.get('/', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

activitiesRouter.get('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Person 2 (Phase 3)
activitiesRouter.post('/', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

activitiesRouter.patch('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

activitiesRouter.delete('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
