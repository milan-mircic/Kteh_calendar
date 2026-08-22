import { randomUUID } from 'crypto';
import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import {
  createActivity,
  deleteActivity,
  getActivityById,
  listActivitiesForMonth,
  toPublicActivity,
  updateActivity,
} from '../lib/activities';

export const activitiesRouter = Router();

activitiesRouter.use(authMiddleware);

const monthQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month must be in YYYY-MM format'),
});

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

const activityFieldsSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
});

const createActivitySchema = activityFieldsSchema.refine((data) => data.endAt > data.startAt, {
  message: 'endAt must be after startAt',
  path: ['endAt'],
});

const updateActivitySchema = activityFieldsSchema.partial().refine(
  (data) => !data.startAt || !data.endAt || data.endAt > data.startAt,
  { message: 'endAt must be after startAt', path: ['endAt'] },
);

activitiesRouter.post('/', (req, res) => {
  const parsed = createActivitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
    return;
  }

  const row = createActivity({ id: randomUUID(), userId: req.user!.id, ...parsed.data });
  res.status(201).json(toPublicActivity(row));
});

activitiesRouter.patch('/:id', (req, res) => {
  const parsed = updateActivitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
    return;
  }

  const row = updateActivity(req.user!.id, req.params.id, parsed.data);
  if (!row) {
    res.status(404).json({ error: 'Activity not found' });
    return;
  }
  res.json(toPublicActivity(row));
});

activitiesRouter.delete('/:id', (req, res) => {
  const deleted = deleteActivity(req.user!.id, req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Activity not found' });
    return;
  }
  res.status(204).end();
});
