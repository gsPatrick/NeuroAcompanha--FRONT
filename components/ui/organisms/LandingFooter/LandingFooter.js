import InfinityMark from '@/components/ui/atoms/InfinityMark/InfinityMark';
import { APP_NAME } from '@/constants/brand';
import styles from './LandingFooter.module.css';

// Rodapé: marca, as seções e um aviso honesto de que esta é uma versão de demonstração.
export default function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <InfinityMark className={styles.mark} />
          <span className={styles.name}>{APP_NAME}</span>
        </div>

        <nav className={styles.links} aria-label="Seções">
          <a href="#recursos">O que faz</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#instalar">Instalar</a>
          <a href="#cuidado">Cuidado</a>
          <a href="/">Abrir o app</a>
        </nav>

        <p className={styles.note}>Versão de demonstração, com dados de exemplo. Os registros ficam no aparelho.</p>
      </div>
    </footer>
  );
}
