import styles from './LandingButton.module.css';

// Botão-link da landing. variant: primary (pílula escura com ponto pêssego) | ghost (contorno). `href` pode ser rota ou âncora.
export default function LandingButton({ href, variant = 'primary', children }) {
  return (
    <a className={`${styles.button} ${styles[variant]}`} href={href}>
      <span>{children}</span>
      {variant === 'primary' ? <span className={styles.dot} aria-hidden="true" /> : null}
    </a>
  );
}
