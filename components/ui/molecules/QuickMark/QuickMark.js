import styles from './QuickMark.module.css';

// Botão grande de marcação rápida: um toque registra. `count` mostra quantas vezes já foi marcado hoje.
// tone: good | alert | neutral (cor do grupo).
export default function QuickMark({ label, count = 0, tone = 'neutral', onMark }) {
  return (
    <button type="button" className={`${styles.mark} ${styles[tone]}`} onClick={onMark}>
      <span className={styles.label}>{label}</span>
      {count > 0 ? (
        // `key` reinicia a animação a cada nova marcação.
        <span key={count} className={styles.count} aria-label={`${count} hoje`}>
          {count}
        </span>
      ) : null}
    </button>
  );
}
