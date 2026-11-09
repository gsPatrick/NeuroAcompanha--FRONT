'use client';

import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import ProfileBanner from '@/components/ui/organisms/ProfileBanner/ProfileBanner';
import { useChild } from '@/features/children/hooks/useChild';
import { ROUTINE_DAYS } from '@/features/routine/data/days';
import { attendsOn, describeAttendanceDays, describeDay } from '@/features/routine/utils/routine';
import styles from './ChildProfileTemplate.module.css';

// Perfil da criança: quem é (foto, nome, diagnósticos), a rotina da semana e o caminho para o relatório.
export default function ChildProfileTemplate() {
  const router = useRouter();
  const { childId } = useParams();
  const { status, child } = useChild(childId);

  return (
    <AppLayout>
      {status === 'loading' ? (
        <div className={styles.loading}>
          <AppSkeleton shape="circle" />
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
  const attendsToday = attendsOn(child.routine);
  const todayValue = new Date().getDay();

  return (
    <>
      <ProfileBanner
        photo={child.photo}
        person={child.avatar}
        initials={child.name.slice(0, 1)}
        name={child.name}
        tags={child.diagnoses ?? []}
        caption={describeAttendanceDays(child.routine)}
        onBack={onBack}
      />

      <div className={styles.actions}>
        <AppButton icon="chart" fullWidth onClick={() => onOpen(`/criancas/${child.id}/relatorio`)}>
          Ver relatório
        </AppButton>
        {attendsToday ? (
          <AppButton variant="outline" icon="notes" fullWidth onClick={() => onOpen(`/registro/${child.id}`)}>
            Registro de hoje
          </AppButton>
        ) : null}
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Rotina da semana</h3>
        <ul className={styles.routine}>
          {ROUTINE_DAYS.map((day) => {
            const info = child.routine?.[day.value];
            return (
              <li key={day.value} className={`${styles.day} ${info?.attends ? '' : styles.off}`}>
                <span className={`${styles.dayName} ${day.value === todayValue ? styles.dayToday : ''}`}>{day.long}</span>
                <span className={styles.dayInfo}>{describeDay(info)}</span>
                {info?.attends && info.classes.length ? <span className={styles.classes}>{info.classes.filter((name) => name.trim()).join(', ')}</span> : null}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
