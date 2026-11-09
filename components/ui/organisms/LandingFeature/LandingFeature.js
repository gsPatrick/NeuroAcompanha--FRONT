import styles from './LandingFeature.module.css';

// Um bloco do "O que faz": texto (número, título, explicação e pontos) de um lado e uma tela do app do outro.
// `reverse` inverte os lados no computador; no celular o texto vem sempre primeiro.
export default function LandingFeature({ number, title, text, points = [], reverse = false, children }) {
  return (
    <article className={`${styles.feature} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.copy}>
        <span className={styles.number}>{number}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
        {points.length ? (
          <ul className={styles.points}>
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className={styles.visual}>{children}</div>
    </article>
  );
}
