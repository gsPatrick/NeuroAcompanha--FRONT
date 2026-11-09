'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import AgendaDay from '@/components/ui/molecules/AgendaDay/AgendaDay';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import { useChildren } from '@/features/children/hooks/useChildren';
import { useAgendaEntries } from '@/features/reports/hooks/useAgendaEntries';
import { addDays, formatRange, formatWeekdayShort, startOfWeek, toDateKey, weekDates } from '@/features/reports/utils/dates';
import { STATUS_LABELS, summarizeEntries } from '@/features/reports/utils/reportView';
import styles from './AgendaTemplate.module.css';

const FIRST_WEEKS = 4;
const MORE_WEEKS = 4;
const TONES = { done: 'good', suspended: 'alert', today: 'today', off: 'muted', future: 'muted' };

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

// Agenda: lista de semanas (a de agora primeiro) com cada dia e, por criança, se houve atendimento, se foi suspenso
// ou se não era dia de atendimento. Serve para a AT enxergar como foi a semana. Tocar num atendimento com registro abre o dia.
export default function AgendaTemplate() {
  const { status, children } = useChildren();
  const [weeks, setWeeks] = useState(FIRST_WEEKS);
  const thisMonday = useMemo(() => startOfWeek(new Date()), []);

  return (
    <AppLayout title="Agenda" tone="muted">
      {status === 'loading' ? <AppSkeleton shape="title" /> : null}

      {status === 'success' && !children.length ? (
        <EmptyState icon="calendar" title="Nenhuma criança ainda" description="Cadastre os alunos para ver a agenda." />
      ) : null}

      {status === 'success' && children.length ? (
        <>
          {Array.from({ length: weeks }, (_, index) => (
            <WeekSection key={index} students={children} monday={addDays(thisMonday, -7 * index)} />
          ))}

          <AppButton variant="outline" fullWidth onClick={() => setWeeks((current) => current + MORE_WEEKS)}>
            Ver semanas anteriores
          </AppButton>
        </>
      ) : null}
    </AppLayout>
  );
}

function WeekSection({ students, monday }) {
  const router = useRouter();
  // Dias da semana em que ALGUMA criança é atendida (segunda a sexta sempre; sábado e domingo só se alguém atende).
  const dates = useMemo(() => {
    const keys = new Set();
    const all = [];
    students.forEach((child) =>
      weekDates(monday, child.routine).forEach((date) => {
        if (!keys.has(toDateKey(date))) {
          keys.add(toDateKey(date));
          all.push(date);
        }
      }),
    );
    return all.sort((a, b) => a - b);
  }, [students, monday]);

  const { status, rows } = useAgendaEntries(students, dates);
  const totals = summarizeEntries(rows.flatMap((row) => row.entries));
  const summary = [
    plural(totals.done, 'atendimento', 'atendimentos'),
    totals.suspended ? plural(totals.suspended, 'suspenso', 'suspensos') : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <section className={styles.week}>
      <header className={styles.header}>
        <h2 className={styles.range}>{formatRange(dates[0], dates[dates.length - 1])}</h2>
        {status === 'ready' ? <p className={styles.summary}>{summary}</p> : null}
      </header>

      {status === 'loading' ? <AppSkeleton shape="title" /> : null}

      {status === 'ready' ? (
        <div className={styles.days}>
          {dates.map((date, index) => {
            const key = toDateKey(date);
            const lines = rows.map(({ child, entries }) => {
              const entry = entries[index];
              const label = entry.status === 'today' && entry.record ? 'Em andamento' : STATUS_LABELS[entry.status];
              return {
                id: child.id,
                name: child.name.split(' ')[0],
                status: label,
                tone: TONES[entry.status],
                onOpen: entry.record ? () => router.push(`/criancas/${child.id}/dia/${key}`) : undefined,
              };
            });
            return <AgendaDay key={key} weekday={formatWeekdayShort(date)} day={date.getDate()} today={key === toDateKey(new Date())} lines={lines} />;
          })}
        </div>
      ) : null}
    </section>
  );
}
