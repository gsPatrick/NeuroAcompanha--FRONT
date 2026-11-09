import LandingLink from '@/components/ui/atoms/LandingLink/LandingLink';
import LandingHeader from '@/components/ui/organisms/LandingHeader/LandingHeader';
import MarksPreview from '@/features/landing/components/MarksPreview/MarksPreview';
import styles from './LandingHero.module.css';

// Abertura no estilo do banner do app: degradê azul-claro com curvas ao fundo, a promessa e uma tela do registro ao lado.
export default function LandingHero() {
  return (
    <div id="topo" className={styles.hero}>
      <svg className={styles.swirl} viewBox="0 0 220 180" fill="none" aria-hidden="true" focusable="false">
        <path d="M170 -20C120 20 215 55 160 105S125 175 160 205" stroke="currentColor" strokeWidth="30" strokeLinecap="round" />
        <path d="M215 10C185 45 230 80 200 125" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      </svg>

      <LandingHeader />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.kicker}>Para acompanhantes terapêuticas</span>
          <h1 className={styles.title}>Registre o dia da criança sem perder o ritmo do atendimento.</h1>
          <p className={styles.lead}>
            O Neuro Acompanha monta o dia a partir da rotina, deixa você marcar o que acontece com um toque e, no fim da semana, transforma tudo em relatório.
          </p>
          <div className={styles.actions}>
            <LandingLink href="/">Abrir o app</LandingLink>
            <LandingLink href="#recursos" variant="outline">
              Ver o que faz
            </LandingLink>
          </div>
        </div>

        <div className={styles.visual}>
          <MarksPreview />
        </div>
      </div>
    </div>
  );
}
