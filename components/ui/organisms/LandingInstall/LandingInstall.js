import InstallStep from '@/components/ui/molecules/InstallStep/InstallStep';
import styles from './LandingInstall.module.css';

// Instalação como app, com os mesmos passos que o app mostra ao instalar (iPhone pelo Safari).
export default function LandingInstall() {
  return (
    <section id="instalar" className={styles.section} aria-labelledby="instalar-titulo">
      <div className={styles.texts}>
        <h2 id="instalar-titulo" className={styles.heading}>
          Instale como um app, sem loja
        </h2>
        <p className={styles.lead}>
          Vai para a tela inicial do celular, abre em tela cheia e se atualiza sozinho. No Android, abra no Chrome e toque em “Instalar app”. No iPhone, são quatro passos pelo Safari:
        </p>
      </div>

      <ol className={styles.steps}>
        <InstallStep number={1} icon="share" title="Toque em Compartilhar" description="O botão com um quadrado e uma seta para cima, na barra do Safari." />
        <InstallStep number={2} icon="addSquare" title="Escolha “Adicionar à Tela de Início”" description="Role a lista de opções até encontrar." />
        <InstallStep number={3} icon="check" title="Toque em “Adicionar”" description="No canto de cima, à direita." />
        <InstallStep number={4} icon="home" title="Abra pelo ícone" description="Procure o infinito colorido na tela inicial." />
      </ol>
    </section>
  );
}
