import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './QuickMark.module.css';

// Botão grande de marcação rápida: um toque marca, outro toque desmarca (cada marcação vale uma vez só).
// `selected`: já marcado (fica preenchido, com um ✓). tone: good | alert | neutral (cor do grupo).
export default function QuickMark({ label, selected = false, tone = 'neutral', onMark }) {
  return (
    <button type="button" className={`${styles.mark} ${styles[tone]} ${selected ? styles.selected : ''}`} aria-pressed={selected} onClick={onMark}>
      <span className={styles.label}>{label}</span>
      {selected ? (
        <span className={styles.check} aria-hidden="true">
          <AppIcon name="check" size={18} />
        </span>
      ) : null}
    </button>
  );
}
