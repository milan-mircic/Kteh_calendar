import { useEffect, useState } from 'react';
import AccountDropdown from './AccountDropdown';
import { formatClock } from '../lib/date';
import styles from './TopBar.module.css';

// Ucitava "gornji" deo stranice gde se nalaze pozdrav korisniku, trenutno vreme i profilna slika cijim se klikom otvara dropdown meni
export default function TopBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.topBar}>
      <AccountDropdown />
      <span className={styles.clock}>{formatClock(now)}</span>
    </div>
  );
}
