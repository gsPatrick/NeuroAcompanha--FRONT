'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader/AppHeader';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import ProfileButton from '@/components/layout/ProfileButton/ProfileButton';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import MonthCalendar from '@/components/ui/organisms/MonthCalendar/MonthCalendar';
import DashboardSkeleton from '@/features/dashboard/components/DashboardSkeleton/DashboardSkeleton';
import TodayAttendance from '@/features/dashboard/components/TodayAttendance/TodayAttendance';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useRecordedToday } from '@/features/records/hooks/useRecordedToday';
import { setDaySuspended } from '@/features/records/services/recordsStore';
import { selectTodayAppointments } from '@/features/dashboard/utils/dashboardView';
import { warmOffline } from '@/features/offline/warmOffline';
import { useToast } from '@/hooks/useToast';
import { toDateKey } from '@/utils/calendar';
import { formatLongDate, getGreeting } from '@/utils/formatDate';
import styles from './DashboardTemplate.module.css';

export default function DashboardTemplate() {
  const { status, data, reload } = useDashboard();
  const router = useRouter();

  const startRecord = (appointment) => router.push(`/registro/${appointment.childId}`);

  // Com os alunos carregados, deixa as telas do dia a dia guardadas no aparelho (para abrirem sem internet).
  useEffect(() => {
    if (data?.children?.length) warmOffline(data.children, router);
  }, [data, router]);

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
  // "Suspenso hoje" é o status do atendimento do dia na API: já vem marcado se ele foi suspenso antes.
  const [suspendedIds, setSuspendedIds] = useState(() => new Set(data.suspendedIds));
  const showToast = useToast();

  const appointments = selectTodayAppointments(data.appointments);
  const recordedIds = useRecordedToday(appointments.map((item) => item.childId));
  // O calendário marca o dia como suspenso só quando TODOS os atendimentos de hoje foram suspensos.
  const attending = appointments.filter((item) => item.attendsToday !== false);
  const allSuspended = attending.length > 0 && attending.every((item) => suspendedIds.has(item.id));

  // Muda na hora e confirma na API; se não der, volta ao que era e avisa.
  const toggleSuspended = async (appointment) => {
    const suspended = !suspendedIds.has(appointment.id);
    const apply = (value) =>
      setSuspendedIds((current) => {
        const next = new Set(current);
        if (value) next.add(appointment.id);
        else next.delete(appointment.id);
        return next;
      });

    apply(suspended);
    try {
      const { weekReport } = await setDaySuspended(appointment.childId, toDateKey(new Date()), suspended);
      if (weekReport) showToast('Semana completa: o relatório está sendo gerado.');
    } catch {
      apply(!suspended);
      showToast('Não foi possível salvar. Tente de novo.');
    }
  };

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
          recordedIds={recordedIds}
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
