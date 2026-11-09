import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './RecordTimeline.module.css';

// Linha do tempo do dia: horário, o que foi marcado (ou a anotação) e um botão para desfazer.
// `showBlock`: mostra também o momento da rotina (ex.: "Aula de Matemática").
// `items`: [{ id, at, label, tone, blockTitle, text? }] da mais recente para a mais antiga; `formatTime` formata o horário.
export default function RecordTimeline({ items, formatTime, onRemove, showBlock = false }) {
  return (
    <ol className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          <time className={styles.time}>{formatTime(item.at)}</time>
          <span className={`${styles.dot} ${styles[item.tone]}`} aria-hidden="true" />
          <div className={styles.texts}>
            <span className={styles.label}>{item.label}</span>
            {showBlock && item.blockTitle ? <span className={styles.block}>{item.blockTitle}</span> : null}
            {item.text ? <span className={styles.note}>{item.text}</span> : null}
          </div>
          {onRemove ? (
            <button type="button" className={styles.remove} aria-label={`Desfazer ${item.label}`} onClick={() => onRemove(item.id)}>
              <AppIcon name="close" size={18} />
            </button>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
