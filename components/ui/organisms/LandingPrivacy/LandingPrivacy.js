import Reveal from '@/components/ui/molecules/Reveal/Reveal';
import styles from './LandingPrivacy.module.css';

const POINTS = [
  { title: 'Fica no seu aparelho', text: 'Nesta versão, os registros ficam guardados no próprio celular. Nada é enviado para fora.' },
  { title: 'Foto é opcional', text: 'O app funciona com uma ilustração no lugar da foto. Use foto só com a autorização da família.' },
  { title: 'Só o que importa', text: 'Pedimos o necessário para acompanhar: nome, rotina e as observações do dia. Nada além.' },
];

// Cuidado com os dados de uma criança: três pontos objetivos, sem promessa que o app ainda não cumpre.
export default function LandingPrivacy() {
  return (
    <section id="cuidado" className={styles.section} aria-labelledby="cuidado-titulo">
      <div className={styles.inner}>
        <Reveal className={styles.head}>
          <span className={styles.kicker}>Cuidado</span>
          <h2 id="cuidado-titulo" className={styles.title}>
            Dados de uma criança pedem cuidado.
          </h2>
        </Reveal>

        <ul className={styles.points}>
          {POINTS.map((point, index) => (
            <li key={point.title} className={styles.point}>
              <Reveal delay={Math.min(index, 4)}>
                <h3 className={styles.pointTitle}>{point.title}</h3>
                <p className={styles.pointText}>{point.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
