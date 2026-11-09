'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader/AppHeader';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import ProfileButton from '@/components/layout/ProfileButton/ProfileButton';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import MonthCalendar from '@/components/ui/organisms/MonthCalendar/MonthCalendar';
import DashboardSkeleton from '@/features/dashboard/components/DashboardSkeleton/DashboardSkeleton';
import TodayAttendance from '@/features/dashboard/components/TodayAttendance/TodayAttendance';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { selectTodayAppointments } from '@/features/dashboard/utils/dashboardView';
import { formatLongDate, getGreeting } from '@/utils/formatDate';
import styles from './DashboardTemplate.module.css';

export default function DashboardTemplate() {
  const { status, data, reload } = useDashboard();
  const router = useRouter();

  const startRecord = (appointment) => router.push(`/registro/${appointment.childId}`);

  const profileButton = data ? (
    <ProfileButton name={data.user.firstName} photo={data.user.photo} person={data.user.avatar} />
  ) : null;

  return (
    <AppLayout>
      <AppHeader right={profileButton} />

      {status === 'loading' ? <DashboardSkeleton /> : null}

      {status === 'error' ? (
        <EmptyState
          icon="alert"
          title="Não foi possível carregar"
          description="Verifique a conexão e tente novamente."
          actionLabel="Tentar de novo"
          onAction={reload}
        />
      ) : null}

      {status === 'success' ? <DashboardContent data={data} onStartRecord={startRecord} /> : null}
    </AppLayout>
  );
}

function DashboardContent({ data, onStartRecord }) {
  // MOCK: o estado "Suspenso" vale só nesta tela. Com backend, vira o status do atendimento do dia.
  const [suspendedIds, setSuspendedIds] = useState(() => new Set());

  const appointments = selectTodayAppointments(data.appointments);
  // O calendário marca o dia como suspenso só quando TODOS os atendimentos de hoje foram suspensos.
  const allSuspended = appointments.length > 0 && appointments.every((item) => suspendedIds.has(item.id));

  const toggleSuspended = (appointment) =>
    setSuspendedIds((current) => {
      const next = new Set(current);
      if (next.has(appointment.id)) next.delete(appointment.id);
      else next.add(appointment.id);
      return next;
    });

  return (
    <>
      <div className={`${styles.section} ${styles.intro}`}>
        <h1 className={styles.greeting}>
          {getGreeting()}, {data.user.firstName}
        </h1>
        <span className={styles.date}>{formatLongDate()}</span>
      </div>

      <div className={styles.section}>
        <TodayAttendance
          appointments={appointments}
          suspendedIds={suspendedIds}
          onToggleSuspended={toggleSuspended}
          onStartRecord={onStartRecord}
        />
      </div>

      <div className={styles.section}>
        <MonthCalendar attendance={data.attendance} todaySuspended={allSuspended} />
      </div>
    </>
  );
}
