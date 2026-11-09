'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import ProfileBanner from '@/components/ui/organisms/ProfileBanner/ProfileBanner';
import ReportHistory from '@/components/ui/organisms/ReportHistory/ReportHistory';
import { useChild } from '@/features/children/hooks/useChild';
import { buildHistory, formatMonthName, formatWeekDays, toDateKey } from '@/features/reports/utils/dates';
import { attendsOn, describeAttendanceDays } from '@/features/routine/utils/routine';
import styles from './ChildProfileTemplate.module.css';

// Perfil da criança: banner com foto e diagnóstico, o botão do registro de hoje e, embaixo, o histórico por ano e mês
// com as semanas ("09 a 13"). Tocar numa semana abre o relatório dela.
export default function ChildProfileTemplate() {
  const router = useRouter();
  const { childId } = useParams();
  const { status, child } = useChild(childId);

  return (
    <AppLayout>
      {status === 'loading' ? (
        <div className={styles.loading}>
          <AppSkeleton shape="title" />
          <AppSkeleton shape="title" short />
        </div>
      ) : null}

      {status === 'missing' || status === 'error' ? (
        <EmptyState icon="alert" title="Criança não encontrada" description="Volte e escolha uma criança na lista." />
      ) : null}

      {status === 'success' ? <Profile child={child} onOpen={(path) => router.push(path)} onBack={() => router.back()} /> : null}
    </AppLayout>
  );
}

function Profile({ child, onOpen, onBack }) {
  // O histórico começa quando a AT passou a acompanhar a criança (sem essa data, no começo do ano).
  const history = useMemo(() => {
    const now = new Date();
    const from = child.startedAt ? new Date(`${child.startedAt}T12:00:00`) : new Date(now.getFullYear(), 0, 1);
    return buildHistory(child.routine, from, now);
  }, [child]);

  return (
    <>
      <ProfileBanner
        photo={child.photo}
        person={child.avatar}
        initials={child.name.slice(0, 1)}
        name={child.name}
        tags={child.diagnoses ?? []}
        caption={describeAttendanceDays(child.routine)}
        puzzle
        onBack={onBack}
      />

      {attendsOn(child.routine) ? (
        <AppButton icon="notes" fullWidth onClick={() => onOpen(`/registro/${child.id}`)}>
          Registro de hoje
        </AppButton>
      ) : null}

      <ReportHistory
        history={history}
        formatMonth={formatMonthName}
        formatWeek={(week) => formatWeekDays(week.first, week.last)}
        onOpenWeek={(week) => onOpen(`/criancas/${child.id}/semana/${toDateKey(week.monday)}`)}
      />
    </>
  );
}
