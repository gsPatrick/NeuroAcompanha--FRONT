'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppInput from '@/components/ui/atoms/AppInput/AppInput';
import QuickMark from '@/components/ui/molecules/QuickMark/QuickMark';
import RecordTimeline from '@/components/ui/molecules/RecordTimeline/RecordTimeline';
import SectionHeader from '@/components/ui/molecules/SectionHeader/SectionHeader';
import PranchetaCategory from '@/components/ui/organisms/PranchetaCategory/PranchetaCategory';
import { MARK_GROUPS } from '@/features/records/data/quickMarks';
import { getCategoriesForBlock } from '@/features/records/data/prancheta';
import { buildTimeline, countByMark, formatTime } from '@/features/records/utils/recordView';
import RecordScreen from '../RecordScreen/RecordScreen';
import styles from './BlockRecordTemplate.module.css';

// Registro de UM momento da rotina (ex.: Aula de Matemática): marcações rápidas com horário, as perguntas da
// prancheta que fazem sentido ali e uma anotação livre. Tudo salva na hora.
export default function BlockRecordTemplate() {
  const { childId, blockId } = useParams();

  return (
    <RecordScreen childId={childId}>
      {(day) => <BlockContent {...day} blockId={blockId} />}
    </RecordScreen>
  );
}

function BlockContent({ child, record, blockId, addMark, addNote, removeEvent, setAnswer, renameBlock, removeBlock }) {
  const router = useRouter();
  const block = record.blocks.find((item) => item.id === blockId);

  if (!block) {
    return (
      <div className={styles.missing}>
        <p className={styles.missingText}>Este momento não existe mais neste dia.</p>
        <AppButton variant="outline" onClick={() => router.replace(`/registro/${child.id}`)}>
          Ver a rotina de hoje
        </AppButton>
      </div>
    );
  }

  return (
    <BlockBody
      child={child}
      record={record}
      block={block}
      addMark={addMark}
      addNote={addNote}
      removeEvent={removeEvent}
      setAnswer={setAnswer}
      renameBlock={renameBlock}
      onRemove={() => {
        removeBlock(block.id);
        router.replace(`/registro/${child.id}`);
      }}
    />
  );
}

function BlockBody({ child, record, block, addMark, addNote, removeEvent, setAnswer, renameBlock, onRemove }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [editing, setEditing] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const counts = countByMark(record.events, block.id);
  const timeline = buildTimeline(record.events, record.blocks, block.id);
  const categories = getCategoriesForBlock(block.kind);

  const saveNote = () => {
    const text = noteText.trim();
    if (!text) return;
    addNote(block.id, text);
    setNoteText('');
    setNoteOpen(false);
  };

  return (
    <>
      <section className={styles.top}>
        <p className={styles.student}>{child.name}</p>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{block.title}</h1>
          <button type="button" className={styles.edit} onClick={() => setEditing((current) => !current)}>
            {editing ? 'Fechar' : 'Editar'}
          </button>
        </div>
      </section>

      {editing ? (
        <section className={styles.editor}>
          <AppInput
            label={block.kind === 'class' ? 'Aula de hoje (mude a matéria se for outra)' : 'Nome do momento'}
            name="blockTitle"
            autoCapitalize="sentences"
            autoComplete="off"
            value={block.title}
            onChange={(value) => renameBlock(block.id, value)}
          />
          {confirmRemove ? (
            <div className={styles.confirm}>
              <p className={styles.confirmText}>Remover este momento e tudo o que foi marcado nele hoje?</p>
              <div className={styles.confirmActions}>
                <AppButton variant="outline" size="md" onClick={() => setConfirmRemove(false)}>
                  Cancelar
                </AppButton>
                <AppButton variant="destructive" size="md" onClick={onRemove}>
                  Remover
                </AppButton>
              </div>
            </div>
          ) : (
            <AppButton variant="tertiary" size="md" onClick={() => setConfirmRemove(true)}>
              Remover este momento
            </AppButton>
          )}
        </section>
      ) : null}

      <p className={styles.hint}>Toque para marcar. O horário é anotado sozinho.</p>

      {MARK_GROUPS.map((group) => (
        <section key={group.key} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          <div className={styles.grid}>
            {group.marks.map((mark) => (
              <QuickMark key={mark.key} label={mark.label} tone={group.tone} count={counts[mark.key]} onMark={() => addMark(block.id, mark.key)} />
            ))}
          </div>
        </section>
      ))}

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Prancheta</h2>
        <div className={styles.categories}>
          {categories.map((category) => (
            <PranchetaCategory
              key={category.key}
              category={category}
              answers={record.answers[block.id]}
              onAnswer={(question, patch) => setAnswer(block.id, question, patch)}
            />
          ))}
        </div>
      </section>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Anotação</h2>
        {noteOpen ? (
          <div className={styles.note}>
            <textarea
              className={styles.textarea}
              rows={4}
              value={noteText}
              aria-label="Anotação"
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Escreva com suas palavras"
            />
            <div className={styles.noteActions}>
              <AppButton variant="outline" size="md" onClick={() => setNoteOpen(false)}>
                Cancelar
              </AppButton>
              <AppButton size="md" disabled={!noteText.trim()} onClick={saveNote}>
                Salvar
              </AppButton>
            </div>
          </div>
        ) : (
          <AppButton variant="outline" icon="notes" fullWidth onClick={() => setNoteOpen(true)}>
            Escrever uma anotação
          </AppButton>
        )}
      </section>

      <section className={styles.group}>
        <SectionHeader title="Neste momento" ruled />
        {timeline.length ? (
          <RecordTimeline items={timeline} formatTime={formatTime} onRemove={removeEvent} />
        ) : (
          <p className={styles.empty}>Nada marcado ainda. Quando você tocar em uma opção, ela aparece aqui.</p>
        )}
      </section>
    </>
  );
}
