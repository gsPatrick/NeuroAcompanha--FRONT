'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import DayReportRow from '@/components/ui/molecules/DayReportRow/DayReportRow';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import StatTile from '@/components/ui/molecules/StatTile/StatTile';
import { useChild } from '@/features/children/hooks/useChild';
import { useDayEntries } from '@/features/reports/hooks/useDayEntries';
import { addDays, formatRange, formatWeekdayShort, parseDateKey, startOfWeek, toDateKey, weekDates } from '@/features/reports/utils/dates';
import { buildWeekReportText } from '@/features/reports/utils/reportText';
import { useUser } from '@/features/user/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { STATUS_LABELS, summarizeEntries, summarizeRecord } from '@/features/reports/utils/reportView';
import styles from './WeekReportTemplate.module.css';

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const TONES = { done: 'good', suspended: 'alert', today: 'today', off: 'muted', future: 'muted' };

// Relatório de uma semana de uma criança: os totais e, para cada dia, o que foi preenchido.
// Tocar num dia com registro abre o dia. As setas passam para a semana anterior e a próxima.
export default function WeekReportTemplate() {
  const router = useRouter();
  const { childId, monday } = useParams();
  const { status, child } = useChild(childId);

  return (
    <AppLayout tone="muted">
      <button type="button" className={styles.back} onClick={() => router.back()}>
        <AppIcon name="arrowLeft" size={20} />
        Voltar
      </button>

      {status === 'loading' ? <AppSkeleton shape="title" /> : null}
      {status === 'missing' || status === 'error' ? (
        <EmptyState icon="alert" title="Criança não encontrada" description="Volte e escolha uma criança na lista." />
      ) : null}
      {status === 'success' ? <WeekContent child={child} firstMonday={monday} /> : null}
    </AppLayout>
  );
}

function WeekContent({ child, firstMonday }) {
  const router = useRouter();
  const [monday, setMonday] = useState(() => startOfWeek(parseDateKey(firstMonday)));

  const dates = useMemo(() => weekDates(monday, child.routine), [toDateKey(monday), child.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const { status, entries } = useDayEntries(child, dates);
  const totals = summarizeEntries(entries);
  const showToast = useToast();
  const { user } = useUser();
  const isCurrentWeek = toDateKey(monday) === toDateKey(startOfWeek(new Date()));

  // Monta o texto da semana e abre o compartilhar do celular (WhatsApp, Arquivos...); sem ele, copia para colar onde quiser.
  const generate = async () => {
    const text = buildWeekReportText({ child, entries, monday, last: dates[dates.length - 1], author: user?.firstName });
    const title = `Relatório semanal — ${child.name}`;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      showToast('Relatório copiado. Cole onde quiser.');
    } catch (error) {
      // Fechar a folha de compartilhar não é erro.
      if (error?.name !== 'AbortError') showToast('Não foi possível gerar o relatório.');
    }
  };

  return (
    <>
      <p className={styles.student}>{child.name}</p>

      <div className={styles.navigator}>
        <button type="button" className={styles.arrow} aria-label="Semana anterior" onClick={() => setMonday(addDays(monday, -7))}>
          <span className={styles.flip}>
            <AppIcon name="chevronRight" size={22} />
          </span>
        </button>
        <h2 className={styles.range}>{formatRange(dates[0], dates[dates.length - 1])}</h2>
        <button type="button" className={styles.arrow} aria-label="Próxima semana" disabled={isCurrentWeek} onClick={() => setMonday(addDays(monday, 7))}>
          <AppIcon name="chevronRight" size={22} />
        </button>
      </div>

      <AppButton icon="chart" fullWidth disabled={status !== 'ready'} onClick={generate}>
        Gerar relatório
      </AppButton>

      {status === 'loading' ? <AppSkeleton shape="title" /> : null}

      {status === 'ready' ? (
        <>
          <div className={styles.stats}>
            <StatTile value={totals.done} label="Atendimentos" />
            <StatTile value={totals.suspended} label="Suspensos" tone={totals.suspended ? 'alert' : 'neutral'} />
            <StatTile value={totals.wins} label="Conquistas" tone="good" />
            <StatTile value={totals.occurrences} label="Ocorrências" tone={totals.occurrences ? 'alert' : 'neutral'} />
          </div>

          <div className={styles.list}>
            {entries.map((entry) => {
              const numbers = summarizeRecord(entry.record);
              const hasRecord = Boolean(entry.record);
              let summary = '';
              if (hasRecord) {
                summary = [
                  plural(numbers.moments, 'momento', 'momentos'),
                  numbers.wins ? plural(numbers.wins, 'conquista', 'conquistas') : null,
                  numbers.occurrences ? plural(numbers.occurrences, 'ocorrência', 'ocorrências') : null,
                ]
                  .filter(Boolean)
                  .join(' · ');
              } else if (entry.status === 'today') {
                summary = 'Ainda sem registro hoje';
              }

              return (
                <DayReportRow
                  key={entry.key}
                  weekday={formatWeekdayShort(entry.date)}
                  day={entry.date.getDate()}
                  status={STATUS_LABELS[entry.status]}
                  tone={TONES[entry.status]}
                  summary={summary}
                  onOpen={hasRecord ? () => router.push(`/criancas/${child.id}/dia/${entry.key}`) : undefined}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </>
  );
}
