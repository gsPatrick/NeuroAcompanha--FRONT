'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import ChildBannerCard from '@/components/ui/molecules/ChildBannerCard/ChildBannerCard';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import { useChildren } from '@/features/children/hooks/useChildren';
import { attendsOn, describeAttendanceDays } from '@/features/routine/utils/routine';
import styles from './ChildrenTemplate.module.css';

// Aba "Crianças": um cartão no estilo do banner da tela inicial para cada criança que a AT acompanha, com um resumo
// sem título nem data no topo. Tocar num cartão abre o perfil.
export default function ChildrenTemplate() {
  const router = useRouter();
  const { status, children } = useChildren();

  return (
    <AppLayout tone="muted" centered>
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
        <>
          <div className={styles.list}>
            {children.map((child) => {
              const attends = attendsOn(child.routine);
              return (
                <ChildBannerCard
                  key={child.id}
                  name={child.name}
                  photo={child.photo}
                  avatar={child.avatar}
                  diagnoses={child.diagnoses}
                  days={describeAttendanceDays(child.routine)}
                  attendsToday={attends}
                  todayLabel={attends ? 'Atende hoje' : 'Não atende hoje'}
                  onOpen={() => router.push(`/criancas/${child.id}`)}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </AppLayout>
  );
}
