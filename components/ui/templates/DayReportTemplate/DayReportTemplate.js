'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import DayRecordView from '@/components/ui/organisms/DayRecordView/DayRecordView';
import { useChild } from '@/features/children/hooks/useChild';
import { useDayEntries } from '@/features/reports/hooks/useDayEntries';
import { formatDayLong, parseDateKey } from '@/features/reports/utils/dates';
import { STATUS_LABELS } from '@/features/reports/utils/reportView';
import styles from './DayReportTemplate.module.css';

// O que foi preenchido num dia, para ler: momento por momento e o resumo do dia.
export default function DayReportTemplate() {
  const router = useRouter();
  const { childId, date: dateKey } = useParams();
  const { status, child } = useChild(childId);

  const backButton = (
    <button type="button" className={styles.back} onClick={() => router.back()}>
      <AppIcon name="arrowLeft" size={20} />
      Voltar
    </button>
  );

  return (
    <AppLayout title="Dia" navLeft={backButton}>
      {status === 'loading' ? <AppSkeleton shape="title" /> : null}
      {status === 'missing' || status === 'error' ? (
        <EmptyState icon="alert" title="Criança não encontrada" description="Volte e escolha uma criança na lista." />
      ) : null}
      {status === 'success' ? <DayContent child={child} dateKey={dateKey} /> : null}
    </AppLayout>
  );
}

function DayContent({ child, dateKey }) {
  const date = useMemo(() => parseDateKey(dateKey), [dateKey]);
  const { status, entries } = useDayEntries(child, [date]);
  const entry = entries[0];

  return (
    <>
      <div className={styles.top}>
        <p className={styles.student}>{child.name}</p>
        <h2 className={styles.title}>{formatDayLong(date)}</h2>
        {entry ? <p className={styles.status}>{STATUS_LABELS[entry.status]}</p> : null}
      </div>

      {status === 'loading' ? <AppSkeleton shape="title" /> : null}

      {status === 'ready' && entry.record ? <DayRecordView record={entry.record} /> : null}

      {status === 'ready' && !entry.record ? (
        <EmptyState icon="notes" title="Sem registro neste dia" description="Não há nada preenchido para mostrar." />
      ) : null}
    </>
  );
}
