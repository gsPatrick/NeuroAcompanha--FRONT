'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppCard from '@/components/ui/atoms/AppCard/AppCard';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import ChildCard from '@/components/ui/molecules/ChildCard/ChildCard';
import InfoRow from '@/components/ui/molecules/InfoRow/InfoRow';
import MenuRow from '@/components/ui/molecules/MenuRow/MenuRow';
import StatTile from '@/components/ui/molecules/StatTile/StatTile';
import ProfileBanner from '@/components/ui/organisms/ProfileBanner/ProfileBanner';
import AppVersionSetting from '@/features/app-update/components/AppVersionSetting/AppVersionSetting';
import { useFaceId } from '@/features/auth/hooks/useFaceId';
import { signOut } from '@/features/auth/services/authService';
import { useMonthAttendance } from '@/features/attendance/hooks/useMonthAttendance';
import { useChildren } from '@/features/children/hooks/useChildren';
import PhotoUploadButton from '@/features/students/components/PhotoUploadButton/PhotoUploadButton';
import { describeAttendanceDays } from '@/features/routine/utils/routine';
import { useUser } from '@/features/user/hooks/useUser';
import { updateUser } from '@/features/user/services/userService';
import { formatTenure } from '@/features/user/utils/formatTenure';
import styles from './ProfileTemplate.module.css';

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const monthYear = (iso) => capitalize(new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(`${iso}T12:00:00`)));

// Perfil da AT: banner com foto, nome e tempo na plataforma; os números do mês; as crianças que ela acompanha;
// sobre ela; e, no fim, sair e a versão do app.
export default function ProfileTemplate() {
  const router = useRouter();
  const { status, user, reload } = useUser();
  const { children } = useChildren();
  const month = useMonthAttendance();
  const faceId = useFaceId();

  const logout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <AppLayout tone="muted">
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
            photoAction={
              <PhotoUploadButton
                label="Trocar a minha foto"
                onPick={async (photo) => {
                  await updateUser({ photo });
                  reload();
                }}
              />
            }
            onBack={() => router.back()}
          />

          <section className={styles.section}>
            <h2 className={styles.title}>Este mês</h2>
            <div className={styles.stats}>
              <StatTile value={children.length} label={children.length === 1 ? 'Criança' : 'Crianças'} />
              <StatTile value={month.done} label="Atendimentos" tone="good" />
              <StatTile value={month.suspended} label="Suspensos" tone={month.suspended ? 'alert' : 'neutral'} />
            </div>
          </section>

          {children.length ? (
            <section className={styles.section}>
              <h2 className={styles.title}>Minhas crianças</h2>
              <div className={styles.children}>
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
            </section>
          ) : null}

          <section className={styles.section}>
            <h2 className={styles.title}>Sobre</h2>
            <AppCard divided large>
              <InfoRow label="Função" value={user.role} />
              {user.joinedAt ? <InfoRow label="Na plataforma desde" value={monthYear(user.joinedAt)} /> : null}
              <InfoRow label="Atende" value={children.length === 1 ? '1 criança' : `${children.length} crianças`} />
            </AppCard>
          </section>

          <section className={styles.section}>
            <h2 className={styles.title}>Mais</h2>
            <AppCard divided large>
              <MenuRow icon="user" label="Editar perfil" onClick={() => router.push('/profile/editar')} />
              {faceId.supported ? (
                <MenuRow icon="shield" label={faceId.enabled ? 'Desativar Face ID' : 'Entrar com Face ID'} onClick={faceId.toggle} />
              ) : null}
              <MenuRow icon="logout" label="Sair da conta" destructive onClick={logout} />
            </AppCard>
          </section>

          <section className={styles.section}>
            <h2 className={styles.title}>Aplicativo</h2>
            <AppCard padded large>
              <AppVersionSetting />
            </AppCard>
          </section>
        </>
      ) : null}
    </AppLayout>
  );
}
