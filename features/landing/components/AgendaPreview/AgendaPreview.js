import AgendaDay from '@/components/ui/molecules/AgendaDay/AgendaDay';
import AppPreview from '@/components/ui/molecules/AppPreview/AppPreview';
import styles from './AgendaPreview.module.css';

const DAYS = [
  { weekday: 'Seg', day: 2, lines: [['a', 'Criança A', 'Atendido', 'good'], ['b', 'Criança B', 'Atendido', 'good']] },
  { weekday: 'Ter', day: 3, lines: [['a', 'Criança A', 'Atendido', 'good'], ['b', 'Criança B', 'Não atende', 'muted']] },
  { weekday: 'Qua', day: 4, lines: [['a', 'Criança A', 'Suspenso', 'alert'], ['b', 'Criança B', 'Suspenso', 'alert']] },
  { weekday: 'Qui', day: 5, lines: [['a', 'Criança A', 'Hoje', 'today'], ['b', 'Criança B', 'Hoje', 'today']] },
];

// Demonstração da agenda: cada dia com o que houve para cada criança.
export default function AgendaPreview() {
  return (
    <AppPreview>
      <h3 className={styles.range}>2 a 6 de novembro</h3>
      {DAYS.map((item) => (
        <AgendaDay
          key={item.day}
          weekday={item.weekday}
          day={item.day}
          today={item.weekday === 'Qui'}
          lines={item.lines.map(([id, name, status, tone]) => ({ id, name, status, tone }))}
        />
      ))}
    </AppPreview>
  );
}
