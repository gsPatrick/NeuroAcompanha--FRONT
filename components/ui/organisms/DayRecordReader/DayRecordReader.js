'use client';

import { useState } from 'react';
import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import BlockStepper from '@/components/ui/molecules/BlockStepper/BlockStepper';
import BlockRecordPanel from '@/components/ui/organisms/BlockRecordPanel/BlockRecordPanel';
import SummaryPanel from '@/components/ui/organisms/SummaryPanel/SummaryPanel';
import { countAnswered } from '@/features/records/utils/recordView';
import { formatDayLong } from '@/features/reports/utils/dates';
import { STATUS_LABELS } from '@/features/reports/utils/reportView';
import styles from './DayRecordReader.module.css';

const SUMMARY_ID = 'summary';

// O registro de um dia passado, IGUAL à tela em que a AT preenche (os mesmos momentos, marcações, prancheta e resumo),
// só que preenchido e para leitura: nada responde a toque, só dá para navegar entre os momentos.
export default function DayRecordReader({ child, entry, date }) {
  const record = entry.record;
  const [chosenId, setChosenId] = useState(record.blocks[0]?.id ?? SUMMARY_ID);

  const block = record.blocks.find((item) => item.id === chosenId);
  const selected = chosenId === SUMMARY_ID ? null : (block ?? record.blocks[0] ?? null);
  const selectedId = selected ? selected.id : SUMMARY_ID;

  const select = (id) => {
    setChosenId(id);
    document.querySelector('.page-content')?.scrollTo({ top: 0 });
  };

  const tabs = [
    ...record.blocks.map((item) => ({
      id: item.id,
      label: item.title,
      count: record.events.filter((event) => event.blockId === item.id).length + countAnswered(record.answers, item.id),
    })),
    { id: SUMMARY_ID, label: 'Resumo do dia', count: Object.values(record.summary ?? {}).filter((text) => text?.trim()).length },
  ];
  const nextTab = tabs[tabs.findIndex((tab) => tab.id === selectedId) + 1];

  return (
    <>
      <section className={styles.identity}>
        <AppAvatar photo={child.photo} person={child.avatar} initials={child.name.slice(0, 1)} size="xl" />
        <div className={styles.identityTexts}>
          <h1 className={styles.name}>{child.name}</h1>
          <p className={styles.date}>{formatDayLong(date)}</p>
          <p className={styles.status}>{STATUS_LABELS[entry.status]} · só leitura</p>
        </div>
      </section>

      <BlockStepper items={tabs} selectedId={selectedId} onSelect={select} />

      {selected ? (
        <BlockRecordPanel key={selected.id} record={record} block={selected} readOnly />
      ) : (
        <SummaryPanel summary={record.summary ?? {}} readOnly />
      )}

      {nextTab ? (
        <AppButton fullWidth icon="arrowRight" onClick={() => select(nextTab.id)}>
          Próximo: {nextTab.label}
        </AppButton>
      ) : null}
    </>
  );
}
