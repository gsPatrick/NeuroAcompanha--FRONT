import PhoneFrame from '@/components/ui/molecules/PhoneFrame/PhoneFrame';
import AgendaDemo from '@/components/ui/molecules/DemoScreens/AgendaDemo';
import PranchetaDemo from '@/components/ui/molecules/DemoScreens/PranchetaDemo';
import RecordDemo from '@/components/ui/molecules/DemoScreens/RecordDemo';
import RoutineDemo from '@/components/ui/molecules/DemoScreens/RoutineDemo';
import WeekDemo from '@/components/ui/molecules/DemoScreens/WeekDemo';
import Reveal from '@/components/ui/molecules/Reveal/Reveal';
import styles from './LandingFeatures.module.css';

const FEATURES = [
  {
    number: '01',
    title: 'A rotina vira o roteiro do dia.',
    text: 'Ao cadastrar a criança, você diz em quais dias atende, se há acolhimento e quais são as aulas de cada dia. Lanche e brincadeiras entram sozinhos. Na hora de registrar, o dia já está montado, na ordem.',
    points: ['Troque a matéria do dia quando a aula mudar', 'Acrescente um momento (um passeio, um recreio) entre os outros'],
    Screen: RoutineDemo,
    tone: 'blue',
  },
  {
    number: '02',
    title: 'Um toque marca. O horário vem junto.',
    text: 'Como a criança está, o que aconteceu, o que ela conquistou. Cada toque vira uma marcação com hora, direto no momento certo da rotina, sem digitar.',
    points: ['Salva a cada toque e reabre exatamente onde você parou', 'Escreva uma anotação com as suas palavras quando precisar'],
    Screen: RecordDemo,
    tone: 'peach',
  },
  {
    number: '03',
    title: 'A prancheta de papel, sem o papel.',
    text: 'As perguntas da prancheta de observação diária ficam dentro de cada momento, com Sim e Não, e só as que fazem sentido ali: chegada no acolhimento, atenção e aprendizagem na aula, interação na brincadeira.',
    points: ['Sem formulário gigante: tudo aberto, em uma rolagem', 'Resumo do dia no fim, com as suas palavras'],
    Screen: PranchetaDemo,
    tone: 'blue',
  },
  {
    number: '04',
    title: 'Da semana ao relatório.',
    text: 'O histórico de cada criança se organiza por ano, mês e semana. Abra uma semana para ver o que foi preenchido em cada dia e gere o relatório, pronto para compartilhar.',
    points: ['Totais de atendimentos, conquistas e ocorrências', 'Cada dia abre com momentos, marcações e respostas'],
    Screen: WeekDemo,
    tone: 'peach',
  },
  {
    number: '05',
    title: 'A agenda mostra como foi a semana.',
    text: 'Uma lista simples, dia a dia e criança a criança: houve atendimento, foi suspenso ou não era dia de atender. Dá para entender a semana de uma olhada.',
    points: ['Semanas anteriores a um toque', 'Toque num atendimento para ver o que foi registrado'],
    Screen: AgendaDemo,
    tone: 'blue',
  },
];

// O que o sistema faz, em cinco blocos que alternam texto e uma tela de demonstração desenhada em CSS.
export default function LandingFeatures() {
  return (
    <section id="recursos" className={styles.section} aria-labelledby="recursos-titulo">
      <div className={styles.inner}>
        <Reveal>
          <span className={styles.kicker}>O que faz</span>
          <h2 id="recursos-titulo" className={styles.title}>
            Do primeiro toque ao relatório da semana.
          </h2>
        </Reveal>

        <div className={styles.list}>
          {FEATURES.map(({ number, title, text, points, Screen, tone }, index) => (
            <article key={number} className={`${styles.item} ${index % 2 ? styles.reverse : ''}`}>
              <Reveal className={styles.copy}>
                <span className={styles.number}>{number}</span>
                <h3 className={styles.itemTitle}>{title}</h3>
                <p className={styles.text}>{text}</p>
                <ul className={styles.points}>
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={1} className={`${styles.stage} ${tone === 'peach' ? styles.peach : styles.blue}`}>
                <PhoneFrame>
                  <Screen />
                </PhoneFrame>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
