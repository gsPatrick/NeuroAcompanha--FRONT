'use client';

import { useState } from 'react';
import AppButton from '../../atoms/AppButton/AppButton';
import QuickMark from '../../molecules/QuickMark/QuickMark';
import RecordTimeline from '../../molecules/RecordTimeline/RecordTimeline';
import PranchetaSection from '../PranchetaSection/PranchetaSection';
import { MARK_GROUPS } from '@/features/records/data/quickMarks';
import { getCategoriesForBlock } from '@/features/records/data/prancheta';
import { buildTimeline, countByMark, formatTime } from '@/features/records/utils/recordView';
import styles from './BlockRecordPanel.module.css';

// Tudo do momento aberto, numa rolagem só: marcações rápidas (um toque, com horário), anotação, prancheta e o que já foi marcado.
export default function BlockRecordPanel({ record, block, addMark, addNote, removeEvent, setAnswer }) {
  const [noteText, setNoteText] = useState('');

  const counts = countByMark(record.events, block.id);
  const timeline = buildTimeline(record.events, record.blocks, block.id);
  const categories = getCategoriesForBlock(block.kind);

  const saveNote = () => {
    const text = noteText.trim();
    if (!text) return;
    addNote(block.id, text);
    setNoteText('');
  };

  return (
    <div className={styles.panel}>
      {MARK_GROUPS.map((group) => (
        <section key={group.key} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          <div className={styles.marks}>
            {group.marks.map((mark) => (
              <QuickMark key={mark.key} label={mark.label} tone={group.tone} count={counts[mark.key]} onMark={() => addMark(block.id, mark.key)} />
            ))}
          </div>
        </section>
      ))}

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Anotação</h2>
        <textarea
          className={styles.textarea}
          rows={3}
          value={noteText}
          aria-label="Anotação"
          placeholder="Escreva com suas palavras"
          onChange={(event) => setNoteText(event.target.value)}
        />
        <div className={styles.noteAction}>
          <AppButton size="md" icon="notes" disabled={!noteText.trim()} onClick={saveNote}>
            Salvar anotação
          </AppButton>
        </div>
      </section>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Prancheta</h2>
        <div className={styles.categories}>
          {categories.map((category) => (
            <PranchetaSection
              key={category.key}
              category={category}
              answers={record.answers[block.id]}
              onAnswer={(question, patch) => setAnswer(block.id, question, patch)}
            />
          ))}
        </div>
      </section>

      {timeline.length ? (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>Marcado neste momento</h2>
          <RecordTimeline items={timeline} formatTime={formatTime} onRemove={removeEvent} />
        </section>
      ) : null}
    </div>
  );
}
