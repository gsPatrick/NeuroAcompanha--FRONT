import AppCard from '@/components/ui/atoms/AppCard/AppCard';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import styles from './DashboardSkeleton.module.css';

export default function DashboardSkeleton() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Carregando">
      <AppSkeleton shape="title" short />

      {/* Cartão do atendimento de hoje */}
      <AppCard padded large>
        <div className={styles.stack}>
          <div className={styles.identity}>
            <AppSkeleton shape="square" />
            <div className={styles.lines}>
              <AppSkeleton shape="title" />
              <AppSkeleton short />
            </div>
          </div>
          <AppSkeleton />
          <div className={styles.buttons}>
            <AppSkeleton shape="block" />
            <AppSkeleton shape="block" />
          </div>
        </div>
      </AppCard>

      {/* Pendências */}
      <div className={styles.stack}>
        <AppSkeleton shape="title" short />
        <AppSkeleton shape="block" />
      </div>
    </div>
  );
}
