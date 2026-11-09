import BrandLockup from '@/components/ui/molecules/BrandLockup/BrandLockup';
import styles from './AppHeader.module.css';

// Topo das telas principais: logo + nome à esquerda e uma ação (ex.: perfil) à direita.
export default function AppHeader({ right }) {
  return (
    <header className={styles.header}>
      <BrandLockup size="sm" />
      {right ? <div className={styles.right}>{right}</div> : null}
    </header>
  );
}
