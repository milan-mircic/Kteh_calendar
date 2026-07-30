import { useEffect, useState } from 'react';
import { getSessionQuote } from '../lib/quote';
import styles from './Quote.module.css';

// Figma: quote line under the home greeting heading (7:171)
export default function Quote() {
  const [quote, setQuote] = useState<{ content: string; author: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSessionQuote()
      .then((data) => {
        if (!cancelled) setQuote(data);
      })
      .catch(() => {
        // Quote is decorative; fail silently rather than blocking the page.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!quote) return null;

  return (
    <p className={styles.quote}>
      “{quote.content}”
      <span className={styles.author}>— {quote.author}</span>
    </p>
  );
}
