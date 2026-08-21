import { useState } from 'react';
import PageBackground from '../components/PageBackground';
import Calendar from '../components/Calendar';
import DateHeading from '../components/DateHeading';
import Quote from '../components/Quote';
import TopBar from '../components/TopBar';
import ActivitiesList from '../components/ActivitiesList';
import { isSameDay } from '../lib/calendar';
import styles from './HomePage.module.css';

// Figma: 7:171 (list), 34:1232 (empty state), 30:1239 (calendar), 44:2589 (dropdown open)
// route "/home" — one scrollable page: greeting + quote, activities list, month calendar.
// Clicking a date number in the calendar selects that day, so the heading
// and activities list switch to show that day's agenda instead of today's.
export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/home.png" />

      <TopBar />

      <section className={styles.section}>
        <DateHeading date={selectedDate} isToday={isSameDay(selectedDate, new Date())} />
        <Quote />
      </section>

      <section className={styles.section}>
        <ActivitiesList date={selectedDate} />
      </section>

      <section className={styles.section}>
        <Calendar selectedDate={selectedDate} onSelectDate={handleSelectDate} />
      </section>
    </div>
  );
}
