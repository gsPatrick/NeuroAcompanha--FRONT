import InfinityMark from '@/components/ui/atoms/InfinityMark/InfinityMark';
import LandingLink from '@/components/ui/atoms/LandingLink/LandingLink';
import { APP_NAME } from '@/constants/brand';
import styles from './LandingFooter.module.css';

// Fechamento: o convite para abrir o app, a marca e o aviso de que esta é uma versão de demonstração.
export default function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title}>Comece pelo registro de hoje.</h2>
      <LandingLink href="/">Abrir o app</LandingLink>

      <div className={styles.brand}>
        <InfinityMark className={styles.mark} />
        <span className={styles.name}>{APP_NAME}</span>
      </div>
      <p className={styles.note}>Versão de demonstração, com dados de exemplo. Os registros ficam no aparelho.</p>
    </footer>
  );
}
