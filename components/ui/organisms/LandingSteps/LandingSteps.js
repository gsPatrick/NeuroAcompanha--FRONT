import styles from './LandingSteps.module.css';

const STEPS = [
  { title: 'Cadastre a criança', text: 'Nome, neurodivergências e a rotina: dias de atendimento, acolhimento e aulas.' },
  { title: 'Abra o dia', text: 'O roteiro já aparece montado. Troque o que mudou e acrescente o que apareceu.' },
  { title: 'Marque durante o atendimento', text: 'Toques rápidos, perguntas e anotações. Tudo salva na hora e reabre onde você parou.' },
  { title: 'Feche a semana', text: 'Veja cada dia, confira a agenda e gere o relatório para compartilhar.' },
];

// Como funciona, em quatro passos numerados (cartões iguais aos do app).
export default function LandingSteps() {
  return (
    <section id="como-funciona" className={styles.section} aria-labelledby="como-titulo">
      <h2 id="como-titulo" className={styles.heading}>
        Como funciona
      </h2>
      <ol className={styles.steps}>
        {STEPS.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.index}>{index + 1}</span>
            <div className={styles.texts}>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
