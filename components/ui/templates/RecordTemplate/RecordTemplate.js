'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import BlockStepper from '@/components/ui/molecules/BlockStepper/BlockStepper';
import BlockRecordPanel from '@/components/ui/organisms/BlockRecordPanel/BlockRecordPanel';
import SummaryPanel from '@/components/ui/organisms/SummaryPanel/SummaryPanel';
import { recordPath } from '@/features/records/hooks/useRecordDate';
import { parseDateKey } from '@/features/reports/utils/dates';
import { countAnswered, findResumeBlockId } from '@/features/records/utils/recordView';
import { useToast } from '@/hooks/useToast';
import { formatLongDate } from '@/utils/formatDate';
import RecordScreen from '../RecordScreen/RecordScreen';
import styles from './RecordTemplate.module.css';

const SUMMARY_ID = 'summary';

// Registro do dia numa tela só. Em cima, o momento atual da rotina (Acolhimento, Aulas, Lanche, Brincadeiras, Resumo)
// com setas para o anterior e o próximo; trocar muda o conteúdo logo abaixo, sem abrir outra página. Tudo salva na hora.
export default function RecordTemplate() {
  const { childId } = useParams();

  return (
    <RecordScreen childId={childId}>
      {(day) => <RecordContent {...day} />}
    </RecordScreen>
  );
}

function RecordContent({ child, dateKey, record, toggleMark, addNote, removeEvent, setAnswer, setSummary, setCursor, finish }) {
  const router = useRouter();
  const showToast = useToast();
  const [finishing, setFinishing] = useState(false);
  // Reabre no momento em que ela parou (ou no primeiro, se o registro é novo).
  const [chosenId, setChosenId] = useState(findResumeBlockId(record) ?? SUMMARY_ID);

  // Se o momento escolhido deixou de existir (foi removido), volta para o primeiro.
  const block = record.blocks.find((item) => item.id === chosenId);
  const summaryChosen = chosenId === SUMMARY_ID;
  const selected = summaryChosen ? null : (block ?? record.blocks[0] ?? null);
  const showingSummary = !selected;
  const selectedId = selected ? selected.id : SUMMARY_ID;

  const select = (id) => {
    setChosenId(id);
    setCursor(id);
    // A tela rola dentro do Framework7: volta ao topo para começar o novo momento do início.
    document.querySelector('.page-content')?.scrollTo({ top: 0 });
  };

  const tabs = [
    ...record.blocks.map((item) => ({
      id: item.id,
      label: item.title,
      count: record.events.filter((event) => event.blockId === item.id).length + countAnswered(record.answers, item.id),
    })),
    { id: SUMMARY_ID, label: 'Resumo do dia', count: Object.values(record.summary).filter((text) => text?.trim()).length },
  ];

  const nextTab = tabs[tabs.findIndex((tab) => tab.id === selectedId) + 1];

  // Fecha o dia. Se era o último dia de atendimento da semana, a API já começa a gerar o relatório.
  const finishDay = async () => {
    setFinishing(true);
    try {
      const { weekReport } = await finish();
      showToast(weekReport ? 'Dia finalizado. Semana completa: o relatório está sendo gerado.' : 'Dia finalizado.');
      router.back();
    } catch (error) {
      showToast(error?.message || 'Não foi possível finalizar o dia.');
      setFinishing(false);
    }
  };

  return (
    <>
      <section className={styles.identity}>
        <AppAvatar photo={child.photo} person={child.avatar} initials={child.name.slice(0, 1)} size="xl" />
        <div className={styles.identityTexts}>
          <h1 className={styles.name}>{child.name}</h1>
          <p className={styles.date}>{formatLongDate(parseDateKey(dateKey))}</p>
        </div>
      </section>

      <BlockStepper items={tabs} selectedId={selectedId} onSelect={select} />

      {/* Trocar a matéria do dia ou remover o momento (só nos momentos, não no resumo). */}
      {!showingSummary ? (
        <div className={styles.actions}>
          <AppButton variant="outline" fullWidth onClick={() => router.push(recordPath(child.id, dateKey, 'editar'))}>
            Trocar ou remover
          </AppButton>
        </div>
      ) : null}

      {showingSummary ? (
        <SummaryPanel summary={record.summary} onChange={setSummary} />
      ) : (
        <BlockRecordPanel
          key={selected.id}
          record={record}
          block={selected}
          toggleMark={toggleMark}
          addNote={addNote}
          removeEvent={removeEvent}
          setAnswer={setAnswer}
        />
      )}

      {nextTab ? (
        <AppButton fullWidth icon="arrowRight" onClick={() => select(nextTab.id)}>
          Próximo: {nextTab.label}
        </AppButton>
      ) : null}

      {showingSummary ? (
        <AppButton fullWidth icon="check" loading={finishing} onClick={finishDay}>
          {record.status === 'finished' ? 'Finalizar de novo' : 'Finalizar o dia'}
        </AppButton>
      ) : null}

      <AppButton variant="outline" fullWidth icon="plus" onClick={() => router.push(recordPath(child.id, dateKey, 'novo'))}>
        Novo momento
      </AppButton>
    </>
  );
}
