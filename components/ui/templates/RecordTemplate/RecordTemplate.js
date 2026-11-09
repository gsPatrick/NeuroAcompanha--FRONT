'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import BlockTabs from '@/components/ui/molecules/BlockTabs/BlockTabs';
import BlockEditor from '@/components/ui/organisms/BlockEditor/BlockEditor';
import BlockRecordPanel from '@/components/ui/organisms/BlockRecordPanel/BlockRecordPanel';
import SummaryPanel from '@/components/ui/organisms/SummaryPanel/SummaryPanel';
import { countAnswered } from '@/features/records/utils/recordView';
import { formatLongDate } from '@/utils/formatDate';
import RecordScreen from '../RecordScreen/RecordScreen';
import styles from './RecordTemplate.module.css';

const SUMMARY_ID = 'summary';

// Registro do dia numa tela só. Em cima, a rotina de hoje em abas (Acolhimento, Aulas, Lanche, Brincadeiras, Resumo);
// tocar numa aba troca o conteúdo logo abaixo, sem abrir outra página. Tudo salva na hora.
export default function RecordTemplate() {
  const { childId } = useParams();

  return (
    <RecordScreen childId={childId}>
      {(day) => <RecordContent {...day} />}
    </RecordScreen>
  );
}

function RecordContent({ child, record, addMark, addNote, removeEvent, setAnswer, setSummary, addBlock, renameBlock, removeBlock }) {
  const [chosenId, setChosenId] = useState(record.blocks[0]?.id ?? SUMMARY_ID);
  // null | 'add' | 'edit': o painel de mudar a rotina do dia (um só, para não ter vários menus).
  const [editor, setEditor] = useState(null);

  // Se o momento escolhido deixou de existir (foi removido), volta para o primeiro.
  const block = record.blocks.find((item) => item.id === chosenId);
  const summaryChosen = chosenId === SUMMARY_ID;
  const selected = summaryChosen ? null : (block ?? record.blocks[0] ?? null);
  const showingSummary = !selected;
  const selectedId = selected ? selected.id : SUMMARY_ID;

  const select = (id) => {
    setChosenId(id);
    setEditor(null);
  };

  const tabs = [
    ...record.blocks.map((item) => ({
      id: item.id,
      label: item.title,
      count: record.events.filter((event) => event.blockId === item.id).length + countAnswered(record.answers, item.id),
    })),
    { id: SUMMARY_ID, label: 'Resumo do dia', count: Object.values(record.summary).filter((text) => text?.trim()).length },
  ];

  return (
    <>
      <section className={styles.identity}>
        <AppAvatar photo={child.photo} person={child.avatar} initials={child.name.slice(0, 1)} size="xl" />
        <div className={styles.identityTexts}>
          <h1 className={styles.name}>{child.name}</h1>
          <p className={styles.date}>{formatLongDate()}</p>
        </div>
      </section>

      <BlockTabs items={tabs} selectedId={selectedId} onSelect={select} />

      <div className={styles.actions}>
        {!showingSummary ? (
          <AppButton variant="tertiary" size="md" onClick={() => setEditor(editor === 'edit' ? null : 'edit')}>
            Trocar ou remover
          </AppButton>
        ) : (
          <span />
        )}
        <AppButton variant="tertiary" size="md" icon="plus" onClick={() => setEditor(editor === 'add' ? null : 'add')}>
          Novo momento
        </AppButton>
      </div>

      {editor ? (
        <BlockEditor
          key={`${editor}-${selectedId}`}
          block={editor === 'edit' ? selected : null}
          onAdd={(kind, title) => addBlock(kind, title)}
          onRename={renameBlock}
          onRemove={(id) => {
            removeBlock(id);
            setEditor(null);
          }}
          onClose={() => setEditor(null)}
        />
      ) : null}

      {showingSummary ? (
        <SummaryPanel summary={record.summary} onChange={setSummary} />
      ) : (
        <BlockRecordPanel
          key={selected.id}
          record={record}
          block={selected}
          addMark={addMark}
          addNote={addNote}
          removeEvent={removeEvent}
          setAnswer={setAnswer}
        />
      )}
    </>
  );
}
