import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resolveAvatarUrl } from '../lib/avatar';
import PersonIcon from './PersonIcon';
import iconButtonStyles from './IconButton.module.css';
import styles from './AccountDropdown.module.css';

// Figma: Profil_Main (44:2595) trigger + "Main screen - account dropdown" open
// state (44:2589) — "My account" / "Log out" / "Profile picture" menu.

export default function AccountDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarUrl = resolveAvatarUrl(user?.avatarUrl ?? null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  async function handleLogout() {
    close();
    await logout();
    navigate('/');
  }

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={[iconButtonStyles.iconButton, iconButtonStyles.outline, styles.avatar].join(' ')}>
          {avatarUrl ? <img src={avatarUrl} alt="" className={styles.avatarImage} /> : <PersonIcon />}
        </span>
        <span className={styles.greeting}>Hi, {user?.firstName ?? 'there'}</span>
      </button>

      {open && (
        <ul className={styles.menu} role="menu">
          <li role="none">
            <Link role="menuitem" to="/account" className={styles.menuItem} onClick={close}>
              My account
            </Link>
          </li>
          <li role="none">
            <button role="menuitem" type="button" className={styles.menuItem} onClick={handleLogout}>
              Log out
            </button>
          </li>
          <li role="none">
            <Link role="menuitem" to="/account/avatar" className={styles.menuItem} onClick={close}>
              Profile picture
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
