'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import ChildCard from '@/components/ui/molecules/ChildCard/ChildCard';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import { useChildren } from '@/features/children/hooks/useChildren';
import { describeAttendanceDays } from '@/features/routine/utils/routine';
import styles from './ChildrenTemplate.module.css';

// Aba "Crianças": as crianças que a AT atende. Tocar numa abre o perfil dela.
export default function ChildrenTemplate() {
  const router = useRouter();
  const { status, children } = useChildren();

  return (
    <AppLayout title="Crianças">
      {status === 'loading' ? (
        <div className={styles.list}>
          <AppSkeleton shape="title" />
          <AppSkeleton shape="title" />
        </div>
      ) : null}

      {status === 'error' ? (
        <EmptyState icon="alert" title="Não foi possível carregar" description="Verifique a conexão e tente novamente." />
      ) : null}

      {status === 'success' && !children.length ? (
        <EmptyState icon="users" title="Nenhuma criança ainda" description="Cadastre os alunos em Ajustes." />
      ) : null}

      {status === 'success' && children.length ? (
        <div className={styles.list}>
          {children.map((child) => (
            <ChildCard
              key={child.id}
              name={child.name}
              photo={child.photo}
              avatar={child.avatar}
              diagnoses={child.diagnoses}
              days={describeAttendanceDays(child.routine)}
              onOpen={() => router.push(`/criancas/${child.id}`)}
            />
          ))}
        </div>
      ) : null}
    </AppLayout>
  );
}
