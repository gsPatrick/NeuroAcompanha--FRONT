import LandingBand from '@/components/ui/molecules/LandingBand/LandingBand';
import LandingCare from '@/components/ui/organisms/LandingCare/LandingCare';
import LandingFeature from '@/components/ui/organisms/LandingFeature/LandingFeature';
import LandingFooter from '@/components/ui/organisms/LandingFooter/LandingFooter';
import LandingHero from '@/components/ui/organisms/LandingHero/LandingHero';
import LandingInstall from '@/components/ui/organisms/LandingInstall/LandingInstall';
import LandingSteps from '@/components/ui/organisms/LandingSteps/LandingSteps';
import AgendaPreview from '@/features/landing/components/AgendaPreview/AgendaPreview';
import MarksPreview from '@/features/landing/components/MarksPreview/MarksPreview';
import PranchetaPreview from '@/features/landing/components/PranchetaPreview/PranchetaPreview';
import RoutinePreview from '@/features/landing/components/RoutinePreview/RoutinePreview';
import WeekPreview from '@/features/landing/components/WeekPreview/WeekPreview';
import styles from './LandingTemplate.module.css';

// Página de apresentação do sistema (pública, fora do app), com a mesma cara do app: faixas com o degradê azul-claro e as
// curvas da abertura, cartões brancos com cantos grandes, azul-marinho e pêssego. As telas de demonstração usam os próprios componentes do app, sem imagens
// e sem nomes de pessoas. A página rola dentro de um contêiner próprio (o Framework7 trava a rolagem do documento no app).
export default function LandingTemplate() {
  return (
    <div id="landing-scroll" className={styles.page}>
      <LandingHero />

      <main className={styles.bands}>
        <LandingBand>
          <section id="recursos" className={styles.features} aria-labelledby="recursos-titulo">
            <h2 id="recursos-titulo" className={styles.heading}>
              O que o app faz
            </h2>

            <LandingFeature
              number="1"
              title="A rotina vira o roteiro do dia"
              text="Ao cadastrar a criança, você diz em quais dias atende, se há acolhimento e quais são as aulas de cada dia. Lanche e brincadeiras entram sozinhos. Na hora de registrar, o dia já está montado, na ordem."
              points={['Troque a matéria do dia quando a aula mudar', 'Acrescente um momento entre os outros, como um recreio ou um passeio']}
            >
              <RoutinePreview />
            </LandingFeature>

            <LandingFeature
              number="2"
              reverse
              title="Um toque marca, com o horário"
              text="Como a criança está, o que aconteceu, o que ela conquistou. Cada toque vira uma marcação com hora, direto no momento certo da rotina, sem digitar."
              points={['Salva a cada toque e reabre onde você parou', 'Escreva uma anotação com as suas palavras quando precisar']}
            >
              <MarksPreview />
            </LandingFeature>

            <LandingFeature
              number="3"
              title="A prancheta de papel, sem o papel"
              text="As perguntas da prancheta de observação diária ficam dentro de cada momento, com Sim e Não, e só as que fazem sentido ali: chegada no acolhimento, atenção e aprendizagem na aula, interação na brincadeira."
              points={['Tudo aberto, em uma rolagem só', 'Resumo do dia no fim, com as suas palavras']}
            >
              <PranchetaPreview />
            </LandingFeature>

            <LandingFeature
              number="4"
              reverse
              title="Da semana ao relatório"
              text="O histórico de cada criança se organiza por ano, mês e semana. Abra uma semana para ver o que foi preenchido em cada dia e gere o relatório, pronto para compartilhar."
              points={['Totais de atendimentos, conquistas e ocorrências', 'Cada dia abre com momentos, marcações e respostas']}
            >
              <WeekPreview />
            </LandingFeature>

            <LandingFeature
              number="5"
              title="A agenda mostra como foi a semana"
              text="Uma lista simples, dia a dia e criança a criança: houve atendimento, foi suspenso ou não era dia de atender. Dá para entender a semana de uma olhada."
              points={['Semanas anteriores a um toque', 'Toque num atendimento para ver o que foi registrado']}
            >
              <AgendaPreview />
            </LandingFeature>
          </section>
        </LandingBand>

        <LandingBand flip>
          <LandingSteps />
        </LandingBand>
        <LandingBand>
            <LandingInstall />
        </LandingBand>
        <LandingBand flip>
          <LandingCare />
        </LandingBand>
        <LandingBand>
            <LandingFooter />
        </LandingBand>
      </main>
    </div>
  );
}
