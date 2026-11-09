import styles from './AppSwitch.module.css';

// Chave liga/desliga no estilo do iOS. `label` é lido por leitores de tela (o texto visível fica ao lado, no pai).
export default function AppSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.switch} ${checked ? styles.on : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.thumb} />
    </button>
  );
}
