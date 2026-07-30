import { Router } from 'express';

export const quoteRouter = Router();

interface ZenQuote {
  q: string;
  a: string;
}

// Person 1 (Phase 5) — proxy ZenQuotes; never call it from the browser directly
// (it blocks CORS and rate-limits by IP).
quoteRouter.get('/random', async (_req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    if (!response.ok) {
      res.status(502).json({ error: 'Failed to fetch quote' });
      return;
    }
    const [quote] = (await response.json()) as ZenQuote[];
    if (!quote) {
      res.status(502).json({ error: 'Failed to fetch quote' });
      return;
    }
    res.json({ content: quote.q, author: quote.a });
  } catch {
    res.status(502).json({ error: 'Failed to fetch quote' });
  }
});
