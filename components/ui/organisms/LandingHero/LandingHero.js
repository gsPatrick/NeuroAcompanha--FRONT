import InfinityMark from '@/components/ui/atoms/InfinityMark/InfinityMark';
import LandingButton from '@/components/ui/atoms/LandingButton/LandingButton';
import PhoneFrame from '@/components/ui/molecules/PhoneFrame/PhoneFrame';
import RecordDemo from '@/components/ui/molecules/DemoScreens/RecordDemo';
import Reveal from '@/components/ui/molecules/Reveal/Reveal';
import styles from './LandingHero.module.css';

// Abertura: a promessa em uma frase, dois caminhos e, ao lado, o registro de um momento numa tela de celular (desenhada em CSS).
export default function LandingHero() {
  return (
    <header id="topo" className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <InfinityMark className={styles.backdrop} />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <Reveal>
            <span className={styles.kicker}>Para acompanhantes terapêuticas</span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className={styles.title}>Registre o dia da criança sem perder o ritmo do atendimento.</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className={styles.lead}>
              O Neuro Acompanha monta o dia a partir da rotina, deixa você marcar o que acontece com um toque e, no fim da semana,
              transforma tudo em relatório.
            </p>
          </Reveal>
          <Reveal delay={3} className={styles.actions}>
            <LandingButton href="/">Abrir o app</LandingButton>
            <LandingButton href="#recursos" variant="ghost">
              Ver o que faz
            </LandingButton>
          </Reveal>
        </div>

        <Reveal delay={2} className={styles.visual}>
          <PhoneFrame tilt>
            <RecordDemo />
          </PhoneFrame>
        </Reveal>
      </div>
    </header>
  );
}
