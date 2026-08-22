// Ova stranica samo prikazuje vec unete podatke o korisniku

import { Link } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import HomeButton from '../components/HomeButton';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import styles from './AccountPage.module.css';

const PURPOSE_LABELS: Record<string, string> = {
  personal: 'Personal',
  work: 'Work',
  study: 'Study',
  other: 'Other',
};

export default function AccountPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/home.png" />
      <HomeButton className={styles.home} />
      <h1 className={styles.heading}>About me</h1>

      <div className={styles.card}>
        <dl className={styles.fields}>
          <dt>First name:</dt>
          <dd>{user.firstName}</dd>
          <dt>Last name:</dt>
          <dd>{user.lastName}</dd>
          <dt>Purpose of the use:</dt>
          <dd>{user.purpose ? (PURPOSE_LABELS[user.purpose] ?? user.purpose) : '—'}</dd>
          <dt>Email:</dt>
          <dd>{user.email}</dd>
          <dt>Password:</dt>
          <dd aria-hidden>••••••••</dd>
        </dl>
      </div>

      <Link to="/account/edit" className={styles.editLink}>
        <Button type="button">Edit the information</Button>
      </Link>
    </div>
  );
}
