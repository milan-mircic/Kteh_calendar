import PageBackground from '../components/PageBackground';
import Calendar from '../components/Calendar';
import styles from './HomePage.module.css';

// Figma: 7:171 (list), 34:1232 (empty state), 30:1239 (calendar), 44:2589 (dropdown open)
// route "/home" — one scrollable page: greeting + quote, activities list, month calendar.
export default function HomePage() {
  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/home.png" />

      {/* Top bar (greeting + clock): Person 2, Phase 1 */}
      {/* Quote: Person 1, Phase 5 */}
      {/* Activities list + empty state: Person 2, Phase 3 */}

      <section className={styles.section}>
        <Calendar />
      </section>
    </div>
  );
}
