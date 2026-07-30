import styles from './PageBackground.module.css';

// Full-bleed blurred background photo (Figma §6: "Pozadina1"-"6").
// Each screen supplies its own image once it's built.
export default function PageBackground({ src }: { src: string }) {
  return (
    <div className={styles.background}>
      <img src={src} alt="" />
    </div>
  );
}
