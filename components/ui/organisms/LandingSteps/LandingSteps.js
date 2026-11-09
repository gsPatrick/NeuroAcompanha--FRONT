import Reveal from '@/components/ui/molecules/Reveal/Reveal';
import styles from './LandingSteps.module.css';

const STEPS = [
  { title: 'Cadastre a criança', text: 'Nome, neurodivergências e a rotina: dias de atendimento, acolhimento e aulas.' },
  { title: 'Abra o dia', text: 'O roteiro já aparece montado. Troque o que mudou e acrescente o que apareceu.' },
  { title: 'Marque durante o atendimento', text: 'Toques rápidos, a prancheta e anotações. Tudo salva na hora e reabre onde você parou.' },
  { title: 'Feche a semana', text: 'Veja cada dia, confira a agenda e gere o relatório para compartilhar.' },
];

// Como funciona, em quatro passos numerados, ligados por uma linha.
export default function LandingSteps() {
  return (
    <section id="como-funciona" className={styles.section} aria-labelledby="como-titulo">
      <div className={styles.inner}>
        <Reveal>
          <span className={styles.kicker}>Como funciona</span>
          <h2 id="como-titulo" className={styles.title}>
            Quatro passos, do cadastro ao relatório.
          </h2>
        </Reveal>

        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <Reveal delay={Math.min(index, 4)}>
                <span className={styles.index}>{index + 1}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
