import styles from './LandingCare.module.css';

const POINTS = [
  { title: 'Fica no seu aparelho', text: 'Nesta versão, os registros ficam guardados no próprio celular. Nada é enviado para fora.' },
  { title: 'Foto é opcional', text: 'O app funciona com uma ilustração no lugar da foto. Use foto só com a autorização da família.' },
  { title: 'Só o necessário', text: 'Nome, rotina e as observações do dia. Nada além do que a AT precisa para acompanhar.' },
];

// Cuidado com os dados de uma criança: três pontos objetivos, sem prometer o que o app ainda não faz.
export default function LandingCare() {
  return (
    <section id="cuidado" className={styles.section} aria-labelledby="cuidado-titulo">
      <h2 id="cuidado-titulo" className={styles.heading}>
        Dados de uma criança pedem cuidado
      </h2>
      <ul className={styles.points}>
        {POINTS.map((point) => (
          <li key={point.title} className={styles.point}>
            <h3 className={styles.title}>{point.title}</h3>
            <p className={styles.text}>{point.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
