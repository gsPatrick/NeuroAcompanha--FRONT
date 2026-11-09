import styles from './InfoRow.module.css';

// Linha de informação: rótulo pequeno em cima e o valor embaixo (ex.: Função / Acompanhante terapêutica).
export default function InfoRow({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
