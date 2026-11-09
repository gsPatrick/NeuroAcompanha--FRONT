import styles from './SectionHeader.module.css';

// ruled: desenha uma linha fina depois do título, ocupando o resto da largura.
export default function SectionHeader({ title, subtitle, actionLabel, onAction, ruled = false }) {
  return (
    <div className={`${styles.header} ${ruled ? styles.ruled : ''}`}>
      <div className={styles.texts}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {ruled ? <span className={styles.rule} aria-hidden="true" /> : null}
      {actionLabel ? (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
