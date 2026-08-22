import PageBackground from '../components/PageBackground';
import Calendar from '../components/Calendar';
import DateHeading from '../components/DateHeading';
import Quote from '../components/Quote';
import TopBar from '../components/TopBar';
import ActivitiesList from '../components/ActivitiesList';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/home.png" />

      <TopBar />

      <section className={styles.section}>
        <DateHeading />
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
