import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

// Figma: "Medium button" (node 7:159) on the Log in screen (2:4).
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...rest }: ButtonProps) {
  return <button className={[styles.button, className].filter(Boolean).join(' ')} {...rest} />;
}
