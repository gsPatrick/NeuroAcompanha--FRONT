import styles from './QuickMark.module.css';

// Marcação rápida no estilo de folha de resposta de colégio: uma bolinha à esquerda e o nome ao lado.
// Um toque marca a bolinha com um X, outro toque desmarca (cada marcação vale uma vez só).
export default function QuickMark({ label, selected = false, onMark }) {
  return (
    <button type="button" className={styles.mark} aria-pressed={selected} onClick={onMark}>
      <span className={styles.bubble} aria-hidden="true">
        {selected ? (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : null}
      </span>
      <span className={`${styles.label} ${selected ? styles.labelOn : ''}`}>{label}</span>
    </button>
  );
}
