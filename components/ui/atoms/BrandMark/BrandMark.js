import Image from 'next/image';
import styles from './BrandMark.module.css';

// Símbolo do app: infinito multicolorido (neurodiversidade). Decorativo: o nome do app vem do texto da tela.
// size: md (login) | sm (cabeçalhos)
export default function BrandMark({ size = 'md' }) {
  return (
    <Image
      className={`${styles.mark} ${styles[size]}`}
      src="/images/neurodiversity-infinity.jpeg"
      alt=""
      width={1528}
      height={800}
      priority
    />
  );
}
