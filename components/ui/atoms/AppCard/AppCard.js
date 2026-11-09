import styles from './AppCard.module.css';

// Superfície base.
// tone: surface (branco com borda fina) | tint (azul-claro, como o painel do login) | peach (pêssego suave)
// divided: separa os filhos com linhas sutis (listas agrupadas, estilo iOS)
// large: cantos mais arredondados (cards de destaque)
export default function AppCard({ children, tone = 'surface', padded = false, divided = false, large = false }) {
  const classes = [
    styles.card,
    styles[tone],
    padded ? styles.padded : '',
    divided ? styles.divided : '',
    large ? styles.large : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
