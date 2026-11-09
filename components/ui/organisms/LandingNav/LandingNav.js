import InfinityMark from '@/components/ui/atoms/InfinityMark/InfinityMark';
import { APP_NAME } from '@/constants/brand';
import styles from './LandingNav.module.css';

// Navegação fixa em pílula de vidro: marca, âncoras das seções (somem no celular) e o botão para abrir o app.
export default function LandingNav() {
  return (
    <div className={styles.wrap}>
      <nav className={styles.pill} aria-label="Principal">
        <a className={styles.brand} href="#topo" aria-label={`${APP_NAME}, início`}>
          <InfinityMark className={styles.mark} />
          <span className={styles.name}>{APP_NAME}</span>
        </a>
        <div className={styles.links}>
          <a href="#recursos">O que faz</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#instalar">Instalar</a>
          <a href="#cuidado">Cuidado</a>
        </div>
        <a className={styles.cta} href="/">
          Abrir o app
        </a>
      </nav>
    </div>
  );
}
