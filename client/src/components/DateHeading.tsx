import { formatDayHeading } from '../lib/date';
import styles from './DateHeading.module.css';

type DateHeadingProps = {
  date: Date;
  isToday: boolean;
};

// Figma: home greeting heading (7:171), shown above the quote.
export default function DateHeading({ date, isToday }: DateHeadingProps) {
  return <h2 className={styles.heading}>{formatDayHeading(date, isToday)}</h2>;
}
