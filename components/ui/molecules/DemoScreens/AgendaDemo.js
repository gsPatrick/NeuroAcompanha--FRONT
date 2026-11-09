import styles from './DemoScreens.module.css';

const DAYS = [
  { week: 'Seg', day: 2, lines: [['Criança A', 'Atendido', 'Good'], ['Criança B', 'Atendido', 'Good']] },
  { week: 'Ter', day: 3, lines: [['Criança A', 'Atendido', 'Good'], ['Criança B', 'Não atende', 'Muted']] },
  { week: 'Qua', day: 4, lines: [['Criança A', 'Suspenso', 'Bad'], ['Criança B', 'Suspenso', 'Bad']] },
  { week: 'Qui', day: 5, lines: [['Criança A', 'Atendido', 'Good'], ['Criança B', 'Não atende', 'Muted']] },
  { week: 'Sex', day: 6, lines: [['Criança A', 'Hoje', 'Today'], ['Criança B', 'Hoje', 'Today']] },
];

// Tela de demonstração: a agenda da semana, com o que houve em cada dia para cada criança.
export default function AgendaDemo() {
  return (
    <>
      <p className={styles.range}>2 a 6 de novembro</p>
      {DAYS.map((day) => (
        <div key={day.day} className={styles.day}>
          <span className={`${styles.date} ${day.week === 'Sex' ? styles.dateToday : ''}`}>
            <span className={styles.dateWeek}>{day.week}</span>
            <span className={styles.dateNumber}>{day.day}</span>
          </span>
          <span className={styles.dayTexts}>
            {day.lines.map(([name, status, tone]) => (
              <span key={name} className={styles.agendaLine}>
                <span>{name}</span>
                <span className={styles[`status${tone}`]}>{status}</span>
              </span>
            ))}
          </span>
        </div>
      ))}
    </>
  );
}
