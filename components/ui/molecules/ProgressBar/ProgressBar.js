import styles from './ProgressBar.module.css';

// Barra fina de progresso do onboarding (elemento <progress> nativo: acessível e sem estilos inline).
// current/total contam as etapas (a primeira é 1).
export default function ProgressBar({ current, total, label }) {
  return <progress className={styles.bar} value={current} max={total} aria-label={label} />;
}
