'use client';

import { useMemo, useState } from 'react';
import { Page } from 'framework7-react';
import { useParams, useRouter } from 'next/navigation';
import AppAvatar from '@/components/ui/atoms/AppAvatar/AppAvatar';
import AppButton from '@/components/ui/atoms/AppButton/AppButton';
import AppIcon from '@/components/ui/atoms/AppIcon/AppIcon';
import AppSkeleton from '@/components/ui/atoms/AppSkeleton/AppSkeleton';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import QuickMark from '@/components/ui/molecules/QuickMark/QuickMark';
import RecordTimeline from '@/components/ui/molecules/RecordTimeline/RecordTimeline';
import SectionHeader from '@/components/ui/molecules/SectionHeader/SectionHeader';
import { useChildren } from '@/features/children/hooks/useChildren';
import { MARK_GROUPS } from '@/features/records/data/quickMarks';
import { useDayRecord } from '@/features/records/hooks/useDayRecord';
import { buildTimeline, countByMark, formatTime } from '@/features/records/utils/recordView';
import { formatLongDate } from '@/utils/formatDate';
import styles from './RecordTemplate.module.css';

// Registro do dia, pensado para ser usado NO MEIO do atendimento: botões grandes, um toque por marcação,
// o horário é anotado sozinho, e tudo fica salvo na hora. Cada dia começa com um registro novo.
export default function RecordTemplate() {
  const router = useRouter();
  const { childId } = useParams();
  const { status: childrenStatus, children } = useChildren();
  const child = children.find((item) => item.id === childId);

  return (
    <Page noNavbar noToolbar>
      <main className={styles.screen}>
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={() => router.back()}>
            <AppIcon name="arrowLeft" size={20} />
            Voltar
          </button>
        </header>

        {childrenStatus === 'loading' ? <Loading /> : null}

        {childrenStatus === 'success' && !child ? (
          <EmptyState icon="alert" title="Aluno não encontrado" description="Volte e escolha o aluno na tela inicial." />
        ) : null}

        {childrenStatus === 'success' && child ? <RecordContent child={child} /> : null}
      </main>
    </Page>
  );
}

function Loading() {
  return (
    <div className={styles.loading}>
      <AppSkeleton shape="title" />
      <AppSkeleton shape="title" short />
    </div>
  );
}

function RecordContent({ child }) {
  const { status, events, addMark, addNote, removeEvent } = useDayRecord(child.id);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const counts = useMemo(() => countByMark(events), [events]);
  const timeline = useMemo(() => buildTimeline(events), [events]);

  const saveNote = () => {
    const text = noteText.trim();
    if (!text) return;
    addNote(text);
    setNoteText('');
    setNoteOpen(false);
  };

  return (
    <>
      <section className={styles.identity}>
        <AppAvatar photo={child.photo} person={child.avatar} initials={child.name.slice(0, 1)} size="xl" />
        <div className={styles.identityTexts}>
          <h1 className={styles.name}>{child.name}</h1>
          <p className={styles.date}>{formatLongDate()}</p>
        </div>
      </section>

      <p className={styles.hint}>Toque para marcar. O horário é anotado sozinho e o registro recomeça a cada dia.</p>

      {MARK_GROUPS.map((group) => (
        <section key={group.key} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          <div className={styles.grid}>
            {group.marks.map((mark) => (
              <QuickMark
                key={mark.key}
                label={mark.label}
                tone={group.tone}
                count={counts[mark.key]}
                onMark={() => addMark(mark.key)}
              />
            ))}
          </div>
        </section>
      ))}

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Anotação</h2>
        {noteOpen ? (
          <div className={styles.note}>
            <label className={styles.noteLabel} htmlFor="record-note">
              O que aconteceu?
            </label>
            <textarea
              id="record-note"
              className={styles.textarea}
              rows={4}
              value={noteText}
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
        <SectionHeader title="Hoje até agora" ruled />
        {status === 'ready' && timeline.length ? (
          <RecordTimeline items={timeline} formatTime={formatTime} onRemove={removeEvent} />
        ) : null}
        {status === 'ready' && !timeline.length ? (
          <p className={styles.empty}>Nada marcado ainda. Quando você tocar em uma opção, ela aparece aqui.</p>
        ) : null}
      </section>
    </>
  );
}
