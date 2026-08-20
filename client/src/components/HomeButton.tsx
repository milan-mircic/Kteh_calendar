import { Link } from 'react-router-dom';
import iconButtonStyles from './IconButton.module.css';
import styles from './HomeButton.module.css';

// Circular home-navigation control, styled to match BackButton.
type HomeButtonProps = {
  to?: string;
  className?: string;
  'aria-label'?: string;
};

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden focusable="false">
      <path
        d="M4 11 12 4l8 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10v9h12v-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeButton({ to = '/home', className, ...rest }: HomeButtonProps) {
  const classNames = [iconButtonStyles.iconButton, styles.homeButton, className].filter(Boolean).join(' ');
  const label = rest['aria-label'] ?? 'Home';

  return (
    <Link to={to} className={classNames} aria-label={label}>
      <HomeIcon />
    </Link>
  );
}
