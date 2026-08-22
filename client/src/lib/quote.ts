// Prikazivanje motivacionih poruka
import { api } from '../api';

export interface Quote {
  content: string;
  author: string;
}

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
