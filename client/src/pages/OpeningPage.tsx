import { Link } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import Button from '../components/Button';
import GoogleIcon from '../components/GoogleIcon';
import buttonStyles from '../components/Button.module.css';
import { API_URL } from '../api';
import styles from './OpeningPage.module.css';

// Figma: 1:1054 — route "/" (logged out)
export default function OpeningPage() {
  return (
    <div className={styles.page}>
      <PageBackground src="/backgrounds/opening.png" />
      <h1 className={styles.heading}>Calendar app</h1>

      <div className={styles.actions}>
        <Link to="/login" className={styles.link}>
          <Button size="large" type="button">
            Sign in
          </Button>
        </Link>
        <Link to="/register" className={styles.link}>
          <Button size="large" type="button">
            Create an account
          </Button>
        </Link>
        <a href={`${API_URL}/api/auth/google`} className={[buttonStyles.button, buttonStyles.large].join(' ')}>
          <GoogleIcon />
          Sign in with Google
        </a>
      </div>
    </div>
  );
}
