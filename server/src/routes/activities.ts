import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { getActivityById, listActivitiesForMonth, toPublicActivity } from '../lib/activities';

export const activitiesRouter = Router();

activitiesRouter.use(authMiddleware);

const monthQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month must be in YYYY-MM format'),
});

// Person 1 (Phase 3)
activitiesRouter.get('/', (req, res) => {
  const parsed = monthQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid query' });
    return;
  }
  const rows = listActivitiesForMonth(req.user!.id, parsed.data.month);
  res.json(rows.map(toPublicActivity));
});

activitiesRouter.get('/:id', (req, res) => {
  const row = getActivityById(req.user!.id, req.params.id);
  if (!row) {
    res.status(404).json({ error: 'Activity not found' });
    return;
  }
  res.json(toPublicActivity(row));
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
