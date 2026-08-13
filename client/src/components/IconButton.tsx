import type { ButtonHTMLAttributes } from 'react';
import styles from './IconButton.module.css';

// Figma: Material "Icon button" (22:1018 family) — circular action button.
// Used as the base for BackButton and the account-menu trigger.
type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'filled' | 'outline';
};

export default function IconButton({ variant = 'filled', className, ...rest }: IconButtonProps) {
  const classNames = [styles.iconButton, variant === 'outline' && styles.outline, className]
    .filter(Boolean)
    .join(' ');

  return <button type="button" className={classNames} {...rest} />;
}
