import Reveal from '@/components/ui/molecules/Reveal/Reveal';
import styles from './LandingDevice.module.css';

const WAYS = [
  { label: 'iPhone', text: 'Abra no Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”.' },
  { label: 'Android', text: 'Abra no Chrome e toque em “Instalar app”.' },
  { label: 'Sempre atual', text: 'Abre em tela cheia e se atualiza sozinho, sem reinstalar.' },
];

// Instalação como app, sem loja: um bloco azul-marinho com o título e as três formas.
export default function LandingDevice() {
  return (
    <section id="instalar" className={styles.section} aria-labelledby="instalar-titulo">
      <div className={styles.panel}>
        <Reveal className={styles.head}>
          <span className={styles.kicker}>No celular</span>
          <h2 id="instalar-titulo" className={styles.title}>
            Instale como um app, sem passar por loja.
          </h2>
          <p className={styles.lead}>
            O Neuro Acompanha vai para a tela inicial do celular e abre como qualquer aplicativo, pensado para ser usado com uma mão, no meio da sala.
          </p>
        </Reveal>

        <ul className={styles.ways}>
          {WAYS.map((way, index) => (
            <li key={way.label} className={styles.way}>
              <Reveal delay={Math.min(index + 1, 4)}>
                <span className={styles.wayLabel}>{way.label}</span>
                <p className={styles.wayText}>{way.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
