'use client';

import { useMemo } from 'react';
import { Page } from 'framework7-react';
import { useRouter } from 'next/navigation';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import { useChildren } from '@/features/children/hooks/useChildren';
import { useDayRecord } from '@/features/records/hooks/useDayRecord';
import { useDayEntries } from '@/features/reports/hooks/useDayEntries';
import { parseDateKey } from '@/features/reports/utils/dates';
import styles from './RecordScreen.module.css';

// Moldura das telas do registro do dia: botão "Voltar", carregamento e aluno não encontrado.
// Entrega ao conteúdo o aluno e o registro do dia já carregados (render prop). Com `dateKey` (AAAA-MM-DD), carrega aquele dia
// para LEITURA (relatório): entrega { child, entry } em vez do registro editável de hoje.
export default function RecordScreen({ childId, dateKey, children }) {
  const router = useRouter();
  const { status, children: students } = useChildren();
  const child = students.find((item) => item.id === childId);

  return (
    <Page noNavbar noToolbar>
      <main className={styles.screen}>
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={() => router.back()}>
            <AppIcon name="arrowLeft" size={20} />
            Voltar
          </button>
        </header>

        {status === 'loading' ? (
          <div className={styles.loading}>
            <AppSkeleton shape="title" />
            <AppSkeleton shape="title" short />
          </div>
        ) : null}

        {status === 'success' && !child ? (
          <EmptyState icon="alert" title="Aluno não encontrado" description="Volte e escolha o aluno na tela inicial." />
        ) : null}

        {status === 'success' && child ? (
          dateKey ? <LoadedPast child={child} dateKey={dateKey}>{children}</LoadedPast> : <Loaded child={child}>{children}</Loaded>
        ) : null}
      </main>
    </Page>
  );
}

function Loaded({ child, children }) {
  const day = useDayRecord(child);
  if (day.status === 'error') {
    return <EmptyState icon="alert" title="Não foi possível carregar" description="Verifique a conexão e tente novamente." actionLabel="Tentar de novo" onAction={day.retry} />;
  }
  if (day.status !== 'ready') {
    return (
      <div className={styles.loading}>
        <AppSkeleton shape="title" />
      </div>
    );
  }
  return children({ child, ...day });
}

function LoadedPast({ child, dateKey, children }) {
  const date = useMemo(() => parseDateKey(dateKey), [dateKey]);
  const { status, entries } = useDayEntries(child, [date]);
  if (status === 'error') {
    return <EmptyState icon="alert" title="Não foi possível carregar" description="Verifique a conexão e volte para tentar de novo." />;
  }
  if (status !== 'ready') {
    return (
      <div className={styles.loading}>
        <AppSkeleton shape="title" />
      </div>
    );
  }
  return children({ child, entry: entries[0], date });
}
