import AppIcon from '../../atoms/AppIcon/AppIcon';
import styles from './ReportHistory.module.css';

// Histórico em árvore simples: ANO (tópico maior) -> MÊS -> semanas ("09 a 13"). Tocar numa semana abre o relatório dela.
// `history`: ver buildHistory (features/reports/utils/dates.js); `formatMonth` e `formatWeek` devolvem os textos.
export default function ReportHistory({ history, formatMonth, formatWeek, onOpenWeek }) {
  return (
    <div className={styles.history}>
      {history.map((year) => (
        <section key={year.year} className={styles.year}>
          <h2 className={styles.yearTitle}>{year.year}</h2>

          {year.months.map((month) => (
            <div key={month.month} className={styles.month}>
              <h3 className={styles.monthTitle}>{formatMonth(month.date)}</h3>
              <ul className={styles.weeks}>
                {month.weeks.map((week) => (
                  <li key={week.monday.getTime()}>
                    <button type="button" className={styles.week} onClick={() => onOpenWeek(week)}>
                      <span className={styles.weekLabel}>{formatWeek(week)}</span>
                      <span className={styles.chevron} aria-hidden="true">
                        <AppIcon name="chevronRight" size={20} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
