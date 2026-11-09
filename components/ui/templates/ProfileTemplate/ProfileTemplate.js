'use client';

import { endSession } from '@/features/auth/services/sessionService';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import AppCard from '@/components/ui/atoms/AppCard/AppCard';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import MenuRow from '@/components/ui/molecules/MenuRow/MenuRow';
import { useUser } from '@/features/user/hooks/useUser';
import styles from './ProfileTemplate.module.css';

// Página do perfil da AT: foto, nome, função e atalhos (Ajustes e Sair).
export default function ProfileTemplate() {
  const router = useRouter();

  const logout = () => {
    endSession();
    router.replace('/login');
  };
  const { status, user } = useUser();

  const backButton = (
    <button type="button" className={styles.back} onClick={() => router.back()}>
      <AppIcon name="arrowLeft" size={20} />
      Voltar
    </button>
  );

  return (
    <AppLayout title="Perfil" navLeft={backButton}>
      {status === 'loading' ? (
        <div className={styles.loading}>
          <AppSkeleton shape="circle" />
          <AppSkeleton shape="title" short />
        </div>
      ) : null}

      {status === 'success' ? (
        <>
          <section className={styles.identity}>
            <span className={styles.frame}>
              <AppAvatar photo={user.photo} person={user.avatar} initials={user.firstName.slice(0, 1)} size="xxl" shape="circle" />
            </span>
            <h2 className={styles.name}>{user.firstName}</h2>
            <p className={styles.role}>{user.role}</p>
          </section>

          <AppCard divided large>
            <MenuRow icon="settings" label="Ajustes" onClick={() => router.push('/settings')} />
            <MenuRow icon="logout" label="Sair da conta" destructive onClick={logout} />
          </AppCard>
        </>
      ) : null}
    </AppLayout>
  );
}
