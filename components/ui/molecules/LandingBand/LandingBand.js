import styles from './LandingBand.module.css';

// Faixa de ponta a ponta com o mesmo fundo da abertura: degradê azul-claro com curvas translúcidas.
// `flip` espelha (degradê e curvas para o outro lado) para as faixas alternarem ao descer a página.
export default function LandingBand({ flip = false, children }) {
  return (
    <div className={`${styles.band} ${flip ? styles.flip : ''}`}>
      <svg className={styles.swirl} viewBox="0 0 220 180" fill="none" aria-hidden="true" focusable="false">
        <path d="M170 -20C120 20 215 55 160 105S125 175 160 205" stroke="currentColor" strokeWidth="30" strokeLinecap="round" />
        <path d="M215 10C185 45 230 80 200 125" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      </svg>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
