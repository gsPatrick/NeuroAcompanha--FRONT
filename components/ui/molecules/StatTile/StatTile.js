import styles from './StatTile.module.css';

// Número grande com legenda (ex.: 4 / Atendimentos). tone: neutral | good | alert.
export default function StatTile({ value, label, tone = 'neutral' }) {
  return (
    <div className={`${styles.tile} ${styles[tone]}`}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
