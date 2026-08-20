import PageBackground from '../components/PageBackground';
import Calendar from '../components/Calendar';
import Quote from '../components/Quote';
import TopBar from '../components/TopBar';
import ActivitiesList from '../components/ActivitiesList';
import styles from './HomePage.module.css';

// Figma: 7:171 (list), 34:1232 (empty state), 30:1239 (calendar), 44:2589 (dropdown open)
// route "/home" — one scrollable page: greeting + quote, activities list, month calendar.
export default function HomePage() {
  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/home.png" />

      <TopBar />

      <section className={styles.section}>
        <Quote />
      </section>

      <section className={styles.section}>
        <ActivitiesList />
      </section>

      <section className={styles.section}>
        <Calendar />
      </section>
    </div>
  );
}
