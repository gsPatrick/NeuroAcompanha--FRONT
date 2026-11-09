import BrandMark from '../../atoms/BrandMark/BrandMark';
import styles from './BrandLockup.module.css';

// Símbolo + nome do sistema, lado a lado. O nome fica em duas linhas para ter peso visual.
// size: md (login, com <h1>) | sm (cabeçalhos das telas, sem título de página)
export default function BrandLockup({ size = 'md' }) {
  const Name = size === 'md' ? 'h1' : 'p';

  return (
    <div className={`${styles.lockup} ${styles[size]}`}>
      <BrandMark size={size} />
      <Name className={styles.name}>
        <span>Neuro</span>
        <span>Acompanha</span>
      </Name>
    </div>
  );
}
