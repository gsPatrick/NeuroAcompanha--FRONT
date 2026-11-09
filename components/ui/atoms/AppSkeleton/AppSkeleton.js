import styles from './AppSkeleton.module.css';

// Bloco de carregamento. As dimensões vêm de classes utilitárias (sem inline style).
// shape: line | title | circle | block | square (o tamanho do quadrado vem de quem usa)
export default function AppSkeleton({ shape = 'line', short = false }) {
  const classes = [styles.skeleton, styles[shape], short ? styles.short : ''].filter(Boolean).join(' ');
  return <span className={classes} aria-hidden="true" />;
}
