import styles from './LandingLink.module.css';

// Link com cara de botão, igual aos botões do app. variant: primary (azul-marinho) | outline (contorno).
export default function LandingLink({ href, variant = 'primary', children }) {
  return (
    <a className={`${styles.link} ${styles[variant]}`} href={href}>
      {children}
    </a>
  );
}
