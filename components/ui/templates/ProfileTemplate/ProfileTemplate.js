'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppCard from '@/components/ui/atoms/AppCard/AppCard';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import MenuRow from '@/components/ui/molecules/MenuRow/MenuRow';
import ProfileBanner from '@/components/ui/organisms/ProfileBanner/ProfileBanner';
import { endSession } from '@/features/auth/services/sessionService';
import { useUser } from '@/features/user/hooks/useUser';
import { formatTenure } from '@/features/user/utils/formatTenure';
import styles from './ProfileTemplate.module.css';

// Perfil da AT: banner grande com a foto, o nome e o tempo na plataforma; embaixo, Ajustes, instalar o app e sair.
export default function ProfileTemplate() {
  const router = useRouter();
  const { status, user } = useUser();

  const logout = () => {
    endSession();
    router.replace('/login');
  };

  return (
    <AppLayout>
      {status === 'loading' ? (
        <div className={styles.loading}>
          <AppSkeleton shape="title" />
          <AppSkeleton shape="title" short />
        </div>
      ) : null}

      {status === 'success' ? (
        <>
          <ProfileBanner
            photo={user.photo}
            person={user.avatar}
            initials={user.firstName.slice(0, 1)}
            name={user.firstName}
            subtitle={user.role}
            caption={user.joinedAt ? `Na plataforma há ${formatTenure(user.joinedAt)}` : undefined}
            onBack={() => router.back()}
          />

          <section className={styles.more}>
            <h2 className={styles.moreTitle}>Mais</h2>
            <AppCard divided large>
              <MenuRow icon="settings" label="Ajustes" onClick={() => router.push('/settings')} />
              <MenuRow icon="smartphone" label="Instalar o app" onClick={() => router.push('/instalar')} />
              <MenuRow icon="logout" label="Sair da conta" destructive onClick={logout} />
            </AppCard>
          </section>
        </>
      ) : null}
    </AppLayout>
  );
}
