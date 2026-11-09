import styles from './DemoScreens.module.css';

const DAYS = [
  { week: 'Seg', day: 9, text: '7 momentos · 8 conquistas' },
  { week: 'Ter', day: 10, text: '6 momentos · 5 conquistas · 1 ocorrência' },
  { week: 'Qua', day: 11, text: '7 momentos · 9 conquistas' },
  { week: 'Qui', day: 12, text: '7 momentos · 4 conquistas' },
];

// Tela de demonstração: o relatório de uma semana, com totais e uma linha por dia.
export default function WeekDemo() {
  return (
    <>
      <p className={styles.range}>9 a 13 de novembro</p>
      <div className={styles.stats}>
        <div className={styles.stat}><span className={styles.statValue}>4</span><span className={styles.statLabel}>Atendimentos</span></div>
        <div className={`${styles.stat} ${styles.statBad}`}><span className={styles.statValue}>1</span><span className={styles.statLabel}>Suspensos</span></div>
        <div className={`${styles.stat} ${styles.statGood}`}><span className={styles.statValue}>26</span><span className={styles.statLabel}>Conquistas</span></div>
        <div className={`${styles.stat} ${styles.statBad}`}><span className={styles.statValue}>1</span><span className={styles.statLabel}>Ocorrências</span></div>
      </div>
      {DAYS.map((day) => (
        <div key={day.day} className={styles.day}>
          <span className={styles.date}><span className={styles.dateWeek}>{day.week}</span><span className={styles.dateNumber}>{day.day}</span></span>
          <span className={styles.dayTexts}>
            <span className={styles.statusGood}>Atendido</span>
            <span className={styles.sub}>{day.text}</span>
          </span>
        </div>
      ))}
    </>
  );
}
