import { Router } from 'express';

export const quoteRouter = Router();

// Person 1 (Phase 5) — proxy ZenQuotes; never call it from the browser directly.
quoteRouter.get('/random', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
