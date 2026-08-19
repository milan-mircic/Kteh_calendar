import { useEffect, useState } from 'react';
import AccountDropdown from './AccountDropdown';
import { formatClock } from '../lib/date';
import styles from './TopBar.module.css';

// Figma: Home top bar — Profil_Main (44:2595, greeting) + Time_stamp (44:2596, clock)
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
