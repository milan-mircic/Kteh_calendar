import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

// Figma: "Input filed - thin" (7:110, Register 7:174) and
// "Input filed - large" (7:155, Log in 2:4).
type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  size?: 'thin' | 'large';
};

export default function Input({ label, size = 'thin', id, className, ...rest }: InputProps) {
  const inputClassName = [styles.input, size === 'large' && styles.large, className]
    .filter(Boolean)
    .join(' ');

  if (!label) {
    return <input id={id} className={inputClassName} {...rest} />;
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input id={id} className={inputClassName} {...rest} />
    </div>
  );
}
