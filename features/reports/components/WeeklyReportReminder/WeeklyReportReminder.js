import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import { getWeekdayLong } from '@/constants/weekdays';
import { REPORT_STATE } from '../../utils/weeklyReports';
import styles from './WeeklyReportReminder.module.css';

const plural = (count, singular, pluralForm) => (count === 1 ? singular : pluralForm);

// Textos de cada estado do relatório: bloco de contagem + situação + prazo.
function describe({ state, days, weekday }) {
  const deadline = `Prazo: ${getWeekdayLong(weekday).toLowerCase()}`;

  if (state === REPORT_STATE.OVERDUE) {
    return { big: String(days), small: plural(days, 'dia', 'dias'), status: `Atrasado há ${days} ${plural(days, 'dia', 'dias')}`, deadline };
  }
  if (state === REPORT_STATE.TODAY) {
    return { big: 'Hoje', small: '', status: 'Vence hoje', deadline, word: true };
  }
  if (days === 1) {
    return { big: 'Amanhã', small: '', status: 'Em dia · vence amanhã', deadline, word: true };
  }
  return { big: String(days), small: 'dias', status: `Em dia · vence em ${days} dias`, deadline };
}

function listNames(items) {
  const names = items.map((item) => item.child.name);
  if (names.length <= 2) return names.join(' e ');
  return `${names[0]}, ${names[1]} e +${names.length - 2}`;
}

// Banner do relatório semanal, nas cores do símbolo da neurodiversidade.
// `summary` vem de getWeeklyReportSummary: { primary, pending }.
// `showChild`: com várias crianças, o título traz o nome e o rodapé lista quem mais está pendente.
export default function WeeklyReportReminder({ summary, showChild = false, onPrepare }) {
  if (!summary) return null;

  const { primary, pending } = summary;
  const view = describe(primary);
  const title = showChild ? `Relatório de ${primary.child.name}` : 'Relatório semanal';

  return (
    <article className={`${styles.card} ${styles[primary.state]}`}>
      <div className={styles.stripe} aria-hidden="true" />

      <div className={styles.main}>
        <div className={`${styles.count} ${view.word ? styles.countWord : ''}`}>
          <span className={styles.big}>{view.big}</span>
          {view.small ? <span className={styles.small}>{view.small}</span> : null}
        </div>

        <div className={styles.texts}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.status}>{view.status}</p>
          <p className={styles.deadline}>{view.deadline}</p>
        </div>
      </div>

      <AppButton size="md" fullWidth onClick={onPrepare}>
        Preparar relatório
      </AppButton>

      {showChild && pending.length ? (
        <p className={styles.pending}>
          Também pendente: <strong>{listNames(pending)}</strong>
        </p>
      ) : null}
    </article>
  );
}
