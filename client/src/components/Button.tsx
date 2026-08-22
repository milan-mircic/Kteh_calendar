import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

// Komponenta srednjih i velikih dugmica
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'medium' | 'large';
};

export default function Button({ size = 'medium', className, ...rest }: ButtonProps) {
  const classNames = [styles.button, size === 'large' && styles.large, className].filter(Boolean).join(' ');
  return <button className={classNames} {...rest} />;
}
