import InfinityMark from '@/components/ui/atoms/InfinityMark/InfinityMark';
import LandingLink from '@/components/ui/atoms/LandingLink/LandingLink';
import { APP_NAME } from '@/constants/brand';
import styles from './LandingHeader.module.css';

// Topo da página: a marca (infinito + nome) à esquerda e o botão para abrir o app à direita, como o cabeçalho do app.
export default function LandingHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#topo" aria-label={`${APP_NAME}, início`}>
        <InfinityMark className={styles.mark} />
        <span className={styles.name}>
          Neuro
          <br />
          Acompanha
        </span>
      </a>
      <LandingLink href="/">Abrir o app</LandingLink>
    </header>
  );
}
