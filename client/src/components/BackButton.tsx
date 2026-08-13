import { Link, useNavigate } from 'react-router-dom';
import iconButtonStyles from './IconButton.module.css';
import styles from './BackButton.module.css';

// Figma: "Back button" (22:130 on Log in, 2:4) — circular back-navigation control.
// Navigates to `to` if given, otherwise goes back one entry in history.
type BackButtonProps = {
  to?: string;
  className?: string;
  'aria-label'?: string;
};

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden focusable="false">
      <path
        d="M15 4 7 12l8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BackButton({ to, className, ...rest }: BackButtonProps) {
  const navigate = useNavigate();
  const classNames = [iconButtonStyles.iconButton, styles.backButton, className].filter(Boolean).join(' ');
  const label = rest['aria-label'] ?? 'Back';

  if (to) {
    return (
      <Link to={to} className={classNames} aria-label={label}>
        <BackIcon />
      </Link>
    );
  }

  return (
    <button type="button" className={classNames} onClick={() => navigate(-1)} aria-label={label}>
      <BackIcon />
    </button>
  );
}
