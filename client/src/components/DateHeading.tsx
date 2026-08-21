import { formatTodayHeading } from '../lib/date';
import styles from './DateHeading.module.css';

// Figma: home greeting heading (7:171), shown above the quote.
export default function DateHeading() {
  return <h2 className={styles.heading}>{formatTodayHeading(new Date())}</h2>;
}
