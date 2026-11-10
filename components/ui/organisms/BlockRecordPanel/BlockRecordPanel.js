'use client';

import { useState } from 'react';
import AppButton from '../../atoms/AppButton/AppButton';
import QuickMark from '../../molecules/QuickMark/QuickMark';
import RecordTimeline from '../../molecules/RecordTimeline/RecordTimeline';
import PranchetaSection from '../PranchetaSection/PranchetaSection';
import { getMarkGroupsForBlock } from '@/features/records/data/quickMarks';
import { getCategoriesForBlock } from '@/features/records/data/prancheta';
import { buildTimeline, formatTime, markedKeys } from '@/features/records/utils/recordView';
import styles from './BlockRecordPanel.module.css';

// `readOnly`: a mesma tela, só para ler (o relatório do dia): nada responde a toque e some o campo de anotação.
// Tudo do momento aberto, numa rolagem só: marcações rápidas (um toque, com horário), anotação, prancheta e o que já foi marcado.
export default function BlockRecordPanel({ record, block, toggleMark, addNote, removeEvent, setAnswer, readOnly = false }) {
  const [noteText, setNoteText] = useState('');

  const marked = markedKeys(record.events, block.id);
  const timeline = buildTimeline(record.events, record.blocks, block.id);
  const groups = getMarkGroupsForBlock(block.kind);
  const categories = getCategoriesForBlock(block.kind);

  const saveNote = () => {
    const text = noteText.trim();
    if (!text) return;
    addNote(block.id, text);
    setNoteText('');
  };

  return (
    <div className={`${styles.panel} ${readOnly ? styles.readOnly : ''}`}>
      {groups.map((group) => (
        <section key={group.key} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          <div className={styles.marks}>
            {group.marks.map((mark) => (
              <QuickMark key={mark.key} label={mark.label} selected={marked.has(mark.key)} onMark={readOnly ? undefined : () => toggleMark(block.id, mark.key)} />
            ))}
          </div>
        </section>
      ))}

      {readOnly ? null : (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>Anotação</h2>
          <textarea
            className={styles.textarea}
            rows={3}
            value={noteText}
            aria-label="Anotação"
            placeholder="Escreva com suas palavras"
            onChange={(event) => setNoteText(event.target.value)}
            // Ao sair do campo a anotação já fica salva: nada se perde se ela trocar de momento no meio da frase.
            onBlur={saveNote}
          />
          <div className={styles.noteAction}>
            <AppButton size="md" icon="notes" disabled={!noteText.trim()} onClick={saveNote}>
              Salvar anotação
            </AppButton>
          </div>
        </section>
      )}

      {categories.length ? (
        <section className={styles.group}>
          <div className={styles.categories}>
            {categories.map((category) => (
              <PranchetaSection
                key={category.key}
                category={category}
                answers={record.answers[block.id]}
                readOnly={readOnly}
                onAnswer={(question, patch) => setAnswer?.(block.id, question, patch)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {timeline.length ? (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>Marcado neste momento</h2>
          <RecordTimeline items={timeline} formatTime={formatTime} onRemove={readOnly ? undefined : removeEvent} />
        </section>
      ) : null}
    </div>
  );
}
