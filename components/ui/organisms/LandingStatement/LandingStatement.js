import WordReveal from '@/components/ui/molecules/WordReveal/WordReveal';
import styles from './LandingStatement.module.css';

// A ideia em uma frase, que acende palavra por palavra ao rolar.
export default function LandingStatement() {
  return (
    <section className={styles.section} aria-labelledby="ideia">
      <div className={styles.inner}>
        <span id="ideia" className={styles.kicker}>
          A ideia
        </span>
        <WordReveal
          className={styles.statement}
          text="Quem acompanha uma criança na escola vê tudo e anota quase nada. O Neuro Acompanha existe para que o que importa não se perca no meio do dia."
        />
      </div>
    </section>
  );
}
