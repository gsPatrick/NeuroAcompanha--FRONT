import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './MenuRow.module.css';

// Linha de lista que leva a outra tela ou ação. `destructive`: ação de saída (cor de alerta).
export default function MenuRow({ icon, label, onClick, destructive = false }) {
  return (
    <button type="button" className={`${styles.row} ${destructive ? styles.destructive : ''}`} onClick={onClick}>
      <span className={styles.icon}>
        <AppIcon name={icon} size={20} />
      </span>
      <span className={styles.label}>{label}</span>
      {destructive ? null : <AppIcon name="chevronRight" size={18} className={styles.chevron} />}
    </button>
  );
}
