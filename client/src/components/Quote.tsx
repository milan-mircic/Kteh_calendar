import { useEffect, useState } from 'react';
import { getSessionQuote } from '../lib/quote';
import styles from './Quote.module.css';

// Komponenta za prikazivanje motivacionih poruka
export default function Quote() {
  const [quote, setQuote] = useState<{ content: string; author: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSessionQuote()
      .then((data) => {
        if (!cancelled) setQuote(data);
      })
      .catch(() => {
        // Ukoliko dodje do greske u ucitavanju poruke, ostatak stranice se i dalje ucitava
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
