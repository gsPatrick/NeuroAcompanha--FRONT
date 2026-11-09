import LandingButton from '@/components/ui/atoms/LandingButton/LandingButton';
import Reveal from '@/components/ui/molecules/Reveal/Reveal';
import styles from './LandingCta.module.css';

// Convite final: uma frase grande e o botão para abrir o app.
export default function LandingCta() {
  return (
    <section className={styles.section} aria-labelledby="cta-titulo">
      <Reveal className={styles.inner}>
        <h2 id="cta-titulo" className={styles.title}>
          Comece pelo registro de hoje.
        </h2>
        <p className={styles.text}>Abra o app, cadastre a rotina e marque o primeiro momento do dia.</p>
        <LandingButton href="/">Abrir o app</LandingButton>
      </Reveal>
    </section>
  );
}
