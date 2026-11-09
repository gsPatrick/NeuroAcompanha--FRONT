import styles from './DemoScreens.module.css';

const MOMENTS = [
  { name: 'Acolhimento', done: true },
  { name: 'Português', done: true },
  { name: 'Matemática', current: true },
  { name: 'Ciências' },
  { name: 'Lanche' },
  { name: 'Brincadeiras' },
  { name: 'Resumo do dia' },
];

// Tela de demonstração: a rotina do dia montada, na ordem, com o momento atual em destaque.
export default function RoutineDemo() {
  return (
    <>
      <p className={styles.groupTitle}>Rotina de hoje</p>
      {MOMENTS.map((moment, index) => (
        <div key={moment.name} className={`${styles.moment} ${moment.current ? styles.momentOn : ''}`}>
          <span className={styles.number}>{index + 1}</span>
          <span className={styles.momentName}>{moment.name}</span>
          {moment.done ? <span className={styles.check}>✓</span> : null}
        </div>
      ))}
    </>
  );
}
