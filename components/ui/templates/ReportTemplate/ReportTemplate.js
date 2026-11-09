'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import DayReportRow from '@/components/ui/molecules/DayReportRow/DayReportRow';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import SegmentedControl from '@/components/ui/molecules/SegmentedControl/SegmentedControl';
import StatTile from '@/components/ui/molecules/StatTile/StatTile';
import { useChild } from '@/features/children/hooks/useChild';
import { useDayEntries } from '@/features/reports/hooks/useDayEntries';
import { addDays, formatMonthYear, formatRange, formatWeekdayShort, mondaysOfMonth, startOfWeek, toDateKey, weekDates } from '@/features/reports/utils/dates';
import { STATUS_LABELS, summarizeEntries, summarizeRecord } from '@/features/reports/utils/reportView';
import styles from './ReportTemplate.module.css';

const MODES = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
];
const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
const TONES = { done: 'good', suspended: 'alert', today: 'today', off: 'muted', future: 'muted' };

// Relatório de uma criança, por semana (segunda a sexta, cada dia com o que foi preenchido) ou por mês
// (totais e as semanas do mês). Tocar num dia abre o registro daquele dia; tocar numa semana do mês abre a semana.
export default function ReportTemplate() {
  const router = useRouter();
  const { childId } = useParams();
  const { status, child } = useChild(childId);

  const backButton = (
    <button type="button" className={styles.back} onClick={() => router.back()}>
      <AppIcon name="arrowLeft" size={20} />
      Voltar
    </button>
  );

  return (
    <AppLayout title="Relatório" navLeft={backButton}>
      {status === 'loading' ? <AppSkeleton shape="title" /> : null}
      {status === 'missing' || status === 'error' ? (
        <EmptyState icon="alert" title="Criança não encontrada" description="Volte e escolha uma criança na lista." />
      ) : null}
      {status === 'success' ? <ReportContent child={child} /> : null}
    </AppLayout>
  );
}

function ReportContent({ child }) {
  const router = useRouter();
  const [mode, setMode] = useState('week');
  // `anchor`: um dia qualquer da semana (ou do mês) em exibição.
  const [anchor, setAnchor] = useState(() => new Date());

  const monday = startOfWeek(anchor);
  const dates = useMemo(
    () => (mode === 'week' ? weekDates(monday, child.routine) : mondaysOfMonth(anchor).flatMap((week) => weekDates(week, child.routine)).filter((date) => date.getMonth() === anchor.getMonth())),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, toDateKey(anchor), child.id],
  );
  const { status, entries } = useDayEntries(child, dates);

  const step = (direction) =>
    setAnchor((current) => (mode === 'week' ? addDays(current, direction * 7) : new Date(current.getFullYear(), current.getMonth() + direction, 1)));

  const title = mode === 'week' ? formatRange(monday, weekDates(monday, child.routine).at(-1)) : formatMonthYear(anchor);
  const totals = summarizeEntries(entries);
  const openDay = (entry) => router.push(`/criancas/${child.id}/dia/${entry.key}`);

  return (
    <>
      <p className={styles.student}>{child.name}</p>

      <SegmentedControl options={MODES} value={mode} onChange={setMode} label="Período do relatório" />

      <div className={styles.navigator}>
        <button type="button" className={styles.arrow} aria-label={mode === 'week' ? 'Semana anterior' : 'Mês anterior'} onClick={() => step(-1)}>
          <span className={styles.flip}>
            <AppIcon name="chevronRight" size={22} />
          </span>
        </button>
        <h2 className={styles.range}>{title}</h2>
        <button type="button" className={styles.arrow} aria-label={mode === 'week' ? 'Próxima semana' : 'Próximo mês'} onClick={() => step(1)}>
          <AppIcon name="chevronRight" size={22} />
        </button>
      </div>

      {status === 'loading' ? <AppSkeleton shape="title" /> : null}

      {status === 'ready' ? (
        <>
          <div className={styles.stats}>
            <StatTile value={totals.done} label="Atendimentos" />
            <StatTile value={totals.suspended} label="Suspensos" tone={totals.suspended ? 'alert' : 'neutral'} />
            <StatTile value={totals.wins} label="Conquistas" tone="good" />
            <StatTile value={totals.occurrences} label="Ocorrências" tone={totals.occurrences ? 'alert' : 'neutral'} />
          </div>

          {mode === 'week' ? (
            <div className={styles.list}>
              {entries.map((entry) => (
                <WeekDay key={entry.key} entry={entry} onOpen={openDay} />
              ))}
            </div>
          ) : (
            <MonthWeeks child={child} anchor={anchor} entries={entries} onPick={(week) => { setAnchor(week); setMode('week'); }} />
          )}
        </>
      ) : null}
    </>
  );
}

// Uma linha de dia na semana: status e um resumo do que foi preenchido. Só dias com registro abrem.
function WeekDay({ entry, onOpen }) {
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
      weekday={formatWeekdayShort(entry.date)}
      day={entry.date.getDate()}
      status={STATUS_LABELS[entry.status]}
      tone={TONES[entry.status]}
      summary={summary}
      onOpen={hasRecord ? () => onOpen(entry) : undefined}
    />
  );
}

// Mês: as semanas que tocam o mês, cada uma com seu resumo. Tocar abre a semana.
function MonthWeeks({ child, anchor, entries, onPick }) {
  return (
    <div className={styles.list}>
      {mondaysOfMonth(anchor).map((week) => {
        const days = weekDates(week, child.routine);
        const weekEntries = entries.filter((entry) => days.some((date) => toDateKey(date) === entry.key));
        const totals = summarizeEntries(weekEntries);
        const last = days.at(-1);
        return (
          <DayReportRow
            key={toDateKey(week)}
            weekday="Sem"
            day={week.getDate()}
            status={formatRange(week, last)}
            tone="muted"
            summary={[plural(totals.done, 'atendimento', 'atendimentos'), totals.suspended ? plural(totals.suspended, 'suspenso', 'suspensos') : null, totals.occurrences ? plural(totals.occurrences, 'ocorrência', 'ocorrências') : null].filter(Boolean).join(' · ')}
            onOpen={() => onPick(week)}
          />
        );
      })}
    </div>
  );
}
