import styles from './AppPreview.module.css';

// Uma "tela do app" para olhar: moldura de celular com cantos grandes e o conteúdo montado com os mesmos componentes do app.
// É só demonstração (não responde a toque).
export default function AppPreview({ children }) {
  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={styles.screen}>{children}</div>
    </div>
  );
}
