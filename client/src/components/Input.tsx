import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

// Input polje
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
