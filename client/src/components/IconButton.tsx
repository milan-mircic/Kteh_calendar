import type { ButtonHTMLAttributes } from 'react';
import styles from './IconButton.module.css';

// Osnova od koje je napravljeno home dugme, dugme za dropdown sa informacijama o profilu i, prethodno korisceno, back dugme
type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'filled' | 'outline';
};

export default function IconButton({ variant = 'filled', className, ...rest }: IconButtonProps) {
  const classNames = [styles.iconButton, variant === 'outline' && styles.outline, className]
    .filter(Boolean)
    .join(' ');

  return <button type="button" className={classNames} {...rest} />;
}
