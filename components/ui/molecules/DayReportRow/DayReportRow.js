import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './DayReportRow.module.css';

// Uma linha do relatório: data à esquerda, status e resumo em texto. `onOpen` (opcional) torna a linha tocável.
// tone do status: good | alert | muted | today.
export default function DayReportRow({ weekday, day, status, tone = 'muted', summary, onOpen }) {
  const content = (
    <>
      <span className={`${styles.date} ${tone === 'today' ? styles.dateToday : ''}`}>
        <span className={styles.weekday}>{weekday}</span>
        <span className={styles.day}>{day}</span>
      </span>
      <span className={styles.texts}>
        <span className={`${styles.status} ${styles[tone]}`}>{status}</span>
        {summary ? <span className={styles.summary}>{summary}</span> : null}
      </span>
      {onOpen ? (
        <span className={styles.chevron} aria-hidden="true">
          <AppIcon name="chevronRight" size={20} />
        </span>
      ) : null}
    </>
  );

  return onOpen ? (
    <button type="button" className={styles.row} onClick={onOpen}>
      {content}
    </button>
  ) : (
    <div className={`${styles.row} ${styles.static}`}>{content}</div>
  );
}
