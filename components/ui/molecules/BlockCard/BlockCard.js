import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './BlockCard.module.css';

// Um momento da rotina do dia (Acolhimento, Aula de Matemática, Lanche...). Toque abre o registro dele.
// `kicker`: tipo em letras pequenas (ex.: "Aula"); `progress`: resumo do que já foi marcado.
export default function BlockCard({ kicker, title, progress, onOpen }) {
  return (
    <button type="button" className={styles.card} onClick={onOpen}>
      <span className={styles.texts}>
        {kicker ? <span className={styles.kicker}>{kicker}</span> : null}
        <span className={styles.title}>{title}</span>
        <span className={progress ? styles.progress : styles.empty}>{progress || 'Toque para registrar'}</span>
      </span>
      <span className={styles.chevron} aria-hidden="true">
        <AppIcon name="chevronRight" size={20} />
      </span>
    </button>
  );
}
