'use client';

import { useParams } from 'next/navigation';
import EmptyState from '@/components/ui/molecules/EmptyState/EmptyState';
import DayRecordReader from '@/components/ui/organisms/DayRecordReader/DayRecordReader';
import RecordScreen from '../RecordScreen/RecordScreen';

// O que foi preenchido num dia: a MESMA tela do registro (momentos, marcações, prancheta e resumo), só que preenchida
// e para leitura. Dia sem registro mostra um aviso.
export default function DayReportTemplate() {
  const { childId, date: dateKey } = useParams();

  return (
    <RecordScreen childId={childId} dateKey={dateKey}>
      {({ child, entry, date }) =>
        entry.record ? (
          <DayRecordReader child={child} entry={entry} date={date} />
        ) : (
          <EmptyState icon="notes" title="Sem registro neste dia" description="Não há nada preenchido para mostrar." />
        )
      }
    </RecordScreen>
  );
}
