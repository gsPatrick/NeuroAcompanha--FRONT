import Image from 'next/image';
import styles from './PuzzleMark.module.css';

// Peça de quebra-cabeça (símbolo do autismo). Decorativa: o significado vem do texto ao lado (ex.: o diagnóstico).
export default function PuzzleMark({ size = 40 }) {
  return (
    <Image
      className={styles.mark}
      src="/images/autism-puzzle.webp"
      alt=""
      width={size}
      height={Math.round(size * (1024 / 1009))}
    />
  );
}
