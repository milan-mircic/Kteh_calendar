import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

// Figma: "Medium button" (node 7:159, Log in screen 2:4) is the default size;
// "Main button" (node 7:87, Opening screen 1:1054) is the "large" size.
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'medium' | 'large';
};

export default function Button({ size = 'medium', className, ...rest }: ButtonProps) {
  const classNames = [styles.button, size === 'large' && styles.large, className].filter(Boolean).join(' ');
  return <button className={classNames} {...rest} />;
}
