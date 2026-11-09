import BrandMark from '@/components/ui/atoms/BrandMark/BrandMark';
import { APP_NAME } from '@/constants/brand';
import styles from './Splash.module.css';

// Tela de abertura (símbolo + nome). `leaving` faz sumir suavemente.
export default function Splash({ leaving = false }) {
  return (
    <div className={`${styles.splash} ${leaving ? styles.leaving : ''}`} role="status" aria-label={`Abrindo ${APP_NAME}`}>
      <BrandMark size="md" />
      <p className={styles.name}>{APP_NAME}</p>
    </div>
  );
}
