import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import SectionHeader from '@/components/ui/molecules/SectionHeader/SectionHeader';
import StudentDayCard from '@/components/ui/molecules/StudentDayCard/StudentDayCard';
import styles from './TodayAttendance.module.css';

// Atendimento de hoje: um banner por aluno (foto, nome e diagnóstico), um embaixo do outro e todos iguais.
// Cada banner abre com as ações do dia. `suspendedIds`: ids dos atendimentos marcados como suspensos.
export default function TodayAttendance({ appointments, suspendedIds, onToggleSuspended, onStartRecord }) {
  return (
    <section>
      <SectionHeader title="Atendimento de hoje" ruled />

      {appointments.length ? (
        <div className={styles.list}>
          {appointments.map((appointment) => (
            <StudentDayCard
              key={appointment.id}
              appointment={appointment}
              suspended={suspendedIds.has(appointment.id)}
              onToggleSuspended={onToggleSuspended}
              onStartRecord={onStartRecord}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon="calendar" title="Sem atendimentos hoje" description="Quando houver sessões agendadas, elas aparecem aqui." />
      )}
    </section>
  );
}
