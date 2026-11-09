'use client';

import DayReportRow from '@/components/ui/molecules/DayReportRow/DayReportRow';
import StatTile from '@/components/ui/molecules/StatTile/StatTile';
import AppPreview from '@/components/ui/molecules/AppPreview/AppPreview';
import styles from './WeekPreview.module.css';

// Demonstração do relatório da semana: totais e uma linha por dia.
export default function WeekPreview() {
  return (
    <AppPreview>
      <h3 className={styles.range}>9 a 13 de novembro</h3>
      <div className={styles.stats}>
        <StatTile value={4} label="Atendimentos" />
        <StatTile value={1} label="Suspensos" tone="alert" />
        <StatTile value={26} label="Conquistas" tone="good" />
        <StatTile value={1} label="Ocorrências" tone="alert" />
      </div>
      <div className={styles.days}>
        <DayReportRow weekday="Seg" day={9} status="Atendido" tone="good" summary="7 momentos · 8 conquistas" onOpen={() => {}} />
        <DayReportRow weekday="Ter" day={10} status="Atendido" tone="good" summary="6 momentos · 5 conquistas · 1 ocorrência" onOpen={() => {}} />
        <DayReportRow weekday="Qua" day={11} status="Suspenso" tone="alert" />
      </div>
    </AppPreview>
  );
}
