import { clothingColors, hairColors, skinTones, tileColors } from '@/core/design-system/illustration';
import styles from './PersonIllustration.module.css';

// Personagem flat, rosto sem traços (neutro e não identificável).
// hair: short | curly | long | bun | ponytail | beard
// Nomes de cor vêm de core/design-system/illustration.js.
export default function PersonIllustration({
  hair = 'short',
  hairColor = 'navy',
  skin = 'light',
  clothing = 'navy',
  tile = 'peach',
}) {
  const skinFill = skinTones[skin];
  const hairFill = hairColors[hairColor];
  const clothingFill = clothingColors[clothing];

  // Cabelo que fica ATRÁS do corpo e da cabeça.
  const hairBack = {
    long: <path d="M38 52C33 30 46 21 60 21s27 9 22 31l5 44H33z" fill={hairFill} />,
    curly: (
      <>
        <circle cx="41" cy="44" r="11" fill={hairFill} />
        <circle cx="79" cy="44" r="11" fill={hairFill} />
        <circle cx="45" cy="56" r="8" fill={hairFill} />
        <circle cx="75" cy="56" r="8" fill={hairFill} />
      </>
    ),
    ponytail: <path d="M78 42c17 2 19 24 9 44-3-12-3-26-9-33z" fill={hairFill} />,
    bun: <circle cx="60" cy="22" r="9" fill={hairFill} />,
  }[hair];

  // Cabelo na FRENTE da cabeça (franja / topo).
  const hairFront = {
    short: <path d="M40 52c-3-19 9-27 21-26 14 1 22 12 19 26-4-8-11-13-20-13s-16 5-20 13z" fill={hairFill} />,
    long: <path d="M40 50c-2-15 8-23 20-23 13 0 21 9 20 23-6-7-12-10-20-10s-14 3-20 10z" fill={hairFill} />,
    curly: (
      <>
        <circle cx="48" cy="35" r="10" fill={hairFill} />
        <circle cx="61" cy="31" r="11" fill={hairFill} />
        <circle cx="73" cy="36" r="10" fill={hairFill} />
      </>
    ),
    bun: <path d="M40 52c-3-18 9-27 21-26 14 1 21 12 19 26-4-8-11-12-20-12s-16 4-20 12z" fill={hairFill} />,
    ponytail: <path d="M40 52c-3-19 9-27 21-26 13 1 20 11 19 26-5-9-11-13-20-13s-15 4-20 13z" fill={hairFill} />,
    beard: (
      <>
        <path d="M40 48c-3-16 8-24 20-24s23 8 20 24c-3-7-10-11-20-11s-17 4-20 11z" fill={hairFill} />
        <path d="M41 56c0 20 9 25 19 25s19-5 19-25c-4 10-10 13-19 13s-15-3-19-13z" fill={hairFill} />
      </>
    ),
  }[hair];

  return (
    <svg className={styles.svg} viewBox="0 0 120 120" role="presentation" aria-hidden="true" focusable="false">
      <rect width="120" height="120" rx="16" fill={tileColors[tile]} />
      {hairBack}
      <path d="M16 120c0-27 20-37 44-37s44 10 44 37z" fill={clothingFill} />
      <rect x="52" y="68" width="16" height="22" rx="7" fill={skinFill} />
      <circle cx="40" cy="56" r="4.5" fill={skinFill} />
      <circle cx="80" cy="56" r="4.5" fill={skinFill} />
      <ellipse cx="60" cy="52" rx="20" ry="24" fill={skinFill} />
      {hairFront}
    </svg>
  );
}
