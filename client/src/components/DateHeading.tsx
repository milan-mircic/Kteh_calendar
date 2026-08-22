import { formatTodayHeading } from '../lib/date';
import styles from './DateHeading.module.css';

// Prikaz danasnjeg datuma
export default function DateHeading() {
  return <h2 className={styles.heading}>{formatTodayHeading(new Date())}</h2>;
}
