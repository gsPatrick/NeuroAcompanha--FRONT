import PersonIllustration from '../../atoms/PersonIllustration/PersonIllustration';
import styles from './IllustrationGrid.module.css';

// Duas fileiras de personagens correndo em loop, cada uma para um lado.
const ROWS = [
  [
    { hair: 'curly', hairColor: 'navy', skin: 'tan', clothing: 'blush', tile: 'peach' },
    { hair: 'ponytail', hairColor: 'ginger', skin: 'light', clothing: 'navy', tile: 'peach' },
    { hair: 'beard', hairColor: 'white', skin: 'medium', clothing: 'navy', tile: 'peach' },
    { hair: 'short', hairColor: 'brown', skin: 'deep', clothing: 'mist', tile: 'mist' },
  ],
  [
    { hair: 'long', hairColor: 'black', skin: 'deep', clothing: 'peach', tile: 'peach' },
    { hair: 'curly', hairColor: 'black', skin: 'medium', clothing: 'navy', tile: 'mist' },
    { hair: 'bun', hairColor: 'brown', skin: 'light', clothing: 'peach', tile: 'peach' },
    { hair: 'long', hairColor: 'ginger', skin: 'tan', clothing: 'mist', tile: 'peach' },
  ],
];

// O conjunto é repetido 3x e a trilha anda exatamente 1/3 do comprimento: o loop não tem emenda.
const COPIES = 3;

// compact: cards menores (usado quando o formulário abre e sobra menos espaço).
export default function IllustrationGrid({ compact = false }) {
  return (
    <div className={`${styles.grid} ${compact ? styles.compact : ''}`} aria-hidden="true">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          <div className={`${styles.track} ${rowIndex === 1 ? styles.reverse : ''}`}>
            {Array.from({ length: COPIES }).flatMap((_, copy) =>
              row.map((person, index) => (
                <div key={`${copy}-${index}`} className={styles.tile}>
                  <PersonIllustration {...person} />
                </div>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
