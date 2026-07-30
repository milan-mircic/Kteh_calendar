import { api } from '../api';

export interface Quote {
  content: string;
  author: string;
}

// Fetched once per session and cached in memory (§7 gotcha: fetch once on
// login and hold for the session, never call ZenQuotes from the browser).
let cachedQuote: Promise<Quote> | null = null;

export function getSessionQuote(): Promise<Quote> {
  if (!cachedQuote) {
    cachedQuote = api.get<Quote>('/api/quote/random').catch((err) => {
      cachedQuote = null;
      throw err;
    });
  }
  return cachedQuote;
}
