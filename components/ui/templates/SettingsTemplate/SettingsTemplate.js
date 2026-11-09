'use client';

import { endSession } from '@/features/auth/services/sessionService';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppCard from '@/components/ui/atoms/AppCard/AppCard';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import SectionHeader from '@/components/ui/molecules/SectionHeader/SectionHeader';
import AppVersionSetting from '@/features/app-update/components/AppVersionSetting/AppVersionSetting';
import { useChildren } from '@/features/children/hooks/useChildren';
import ReportDaysSetting from '@/features/settings/components/ReportDaysSetting/ReportDaysSetting';
import { usePreferences } from '@/features/settings/hooks/usePreferences';
import { DEFAULT_REPORT_DAY } from '@/constants/weekdays';
import styles from './SettingsTemplate.module.css';

// As mudanças são salvas na hora. Os alunos e a quantidade são definidos no cadastro inicial (onboarding).
export default function SettingsTemplate() {
  const router = useRouter();

  const logout = () => {
    endSession();
    router.replace('/login');
  };
  const { preferences, setReportDay } = usePreferences();
  const { children, status } = useChildren();

  return (
    <AppLayout title="Ajustes">
      <section>
        <SectionHeader title="Relatório semanal" subtitle="Um dia por criança, uma vez na semana" />
        <AppCard padded large>
          {status === 'loading' ? (
            <div className={styles.loading}>
              <AppSkeleton shape="block" />
              <AppSkeleton shape="block" />
            </div>
          ) : (
            <ReportDaysSetting
              items={children}
              reportDays={preferences.reportDays}
              defaultDay={DEFAULT_REPORT_DAY}
              onChange={setReportDay}
            />
          )}
        </AppCard>
      </section>

      <section>
        <SectionHeader title="Sobre" subtitle="O app se atualiza sozinho quando há versão nova" />
        <AppCard padded large>
          <AppVersionSetting />
        </AppCard>
      </section>

      <div className={styles.actions}>
        <AppButton variant="secondary" fullWidth onClick={() => router.push('/onboarding')}>
          Refazer cadastro dos alunos
        </AppButton>
        <AppButton variant="tertiary" fullWidth onClick={logout}>
          Sair da conta
        </AppButton>
      </div>
    </AppLayout>
  );
}
