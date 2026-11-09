import styles from './AgendaDay.module.css';

// Um dia da agenda: a data à esquerda e, para cada criança, se houve atendimento. `lines`:
// [{ id, name, status, tone, onOpen? }]; tone: good | alert | today | muted. `today` destaca a data.
export default function AgendaDay({ weekday, day, today = false, lines }) {
  return (
    <div className={styles.row}>
      <span className={`${styles.date} ${today ? styles.dateToday : ''}`}>
        <span className={styles.weekday}>{weekday}</span>
        <span className={styles.day}>{day}</span>
      </span>

      <ul className={styles.lines}>
        {lines.map((line) => (
          <li key={line.id}>
            {line.onOpen ? (
              <button type="button" className={`${styles.line} ${styles.tappable}`} onClick={line.onOpen}>
                <span className={styles.name}>{line.name}</span>
                <span className={`${styles.status} ${styles[line.tone]}`}>{line.status}</span>
              </button>
            ) : (
              <div className={styles.line}>
                <span className={styles.name}>{line.name}</span>
                <span className={`${styles.status} ${styles[line.tone]}`}>{line.status}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
