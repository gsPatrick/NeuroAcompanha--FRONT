'use client';

import QuickMark from '@/components/ui/molecules/QuickMark/QuickMark';
import AppPreview from '@/components/ui/molecules/AppPreview/AppPreview';
import RecordTimeline from '@/components/ui/molecules/RecordTimeline/RecordTimeline';
import styles from './MarksPreview.module.css';

const TIMELINE = [
  { id: 't1', at: '09:12', label: 'Pediu ajuda', tone: 'good' },
  { id: 't2', at: '09:05', label: 'Recusa / birra', tone: 'alert' },
  { id: 't3', at: '08:58', label: 'Calmo(a)', tone: 'neutral' },
];

// Demonstração das marcações rápidas (um toque, com contador) e da linha do tempo do momento.
export default function MarksPreview() {
  return (
    <AppPreview>
      <div className={styles.group}>
        <h3 className={styles.title}>Como está agora</h3>
        <div className={styles.grid}>
          <QuickMark label="Calmo(a)" selected />
          <QuickMark label="Animado(a)" />
          <QuickMark label="Ansioso(a)" />
          <QuickMark label="Cansado(a)" />
        </div>
      </div>
      <div className={styles.group}>
        <h3 className={styles.title}>Ocorrências</h3>
        <div className={styles.grid}>
          <QuickMark label="Recusa / birra" tone="alert" selected />
          <QuickMark label="Sobrecarga sensorial" tone="alert" />
        </div>
      </div>
      <div className={styles.group}>
        <h3 className={styles.title}>Conquistas</h3>
        <div className={styles.grid}>
          <QuickMark label="Pediu ajuda" tone="good" selected />
          <QuickMark label="Concluiu a atividade" tone="good" />
        </div>
      </div>
      <RecordTimeline items={TIMELINE} formatTime={(time) => time} />
    </AppPreview>
  );
}
