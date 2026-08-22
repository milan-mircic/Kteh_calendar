import styles from './PageBackground.module.css';

// Komponenta sluzi da ucita razlicite pozadine zavisno od stranice
export default function PageBackground({ src }: { src: string }) {
  return (
    <div className={styles.background}>
      <img src={src} alt="" />
    </div>
  );
}
