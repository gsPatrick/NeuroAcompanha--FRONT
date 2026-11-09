import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './SelectableCard.module.css';

// Cartão que liga/desliga (múltipla escolha). Quando selecionado, mostra o conteúdo extra (ex.: níveis).
export default function SelectableCard({ title, subtitle, selected, onToggle, children }) {
  return (
    <div className={`${styles.card} ${selected ? styles.selected : ''}`}>
      <button type="button" className={styles.header} aria-pressed={selected} onClick={onToggle}>
        <span className={styles.texts}>
          <span className={styles.title}>{title}</span>
          {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
        </span>
        <span className={styles.check} aria-hidden="true">
          {selected ? <AppIcon name="check" size={16} strokeWidth={2.6} /> : null}
        </span>
      </button>

      {selected && children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
}
