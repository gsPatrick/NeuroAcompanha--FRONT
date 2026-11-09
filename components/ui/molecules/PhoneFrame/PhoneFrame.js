import styles from './PhoneFrame.module.css';

// Moldura de celular desenhada em CSS (não é imagem). O conteúdo é uma tela de demonstração, só para olhar.
export default function PhoneFrame({ children, tilt = false }) {
  return (
    <div className={`${styles.phone} ${tilt ? styles.tilt : ''}`} aria-hidden="true">
      <div className={styles.notch} />
      <div className={styles.screen}>{children}</div>
    </div>
  );
}
