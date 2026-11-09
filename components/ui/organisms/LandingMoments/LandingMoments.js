import styles from './LandingMoments.module.css';

const MOMENTS = ['Acolhimento', 'Aula', 'Lanche', 'Brincadeiras', 'Prancheta', 'Resumo do dia', 'Relatório da semana', 'Agenda'];

// Faixa que corre sem parar com os momentos do dia. A lista é repetida para o laço não ter emenda.
export default function LandingMoments() {
  return (
    <section className={styles.band} aria-label="Momentos da rotina">
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <ul key={copy} className={styles.group} aria-hidden={copy === 1 ? 'true' : undefined}>
            {MOMENTS.map((moment) => (
              <li key={moment} className={styles.item}>
                {moment}
                <span className={styles.dot} aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
