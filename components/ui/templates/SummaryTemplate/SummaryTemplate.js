'use client';

import { useParams } from 'next/navigation';
import { SUMMARY_FIELDS } from '@/features/records/data/prancheta';
import { formatLongDate } from '@/utils/formatDate';
import RecordScreen from '../RecordScreen/RecordScreen';
import styles from './SummaryTemplate.module.css';

// Resumo do dia (fim da prancheta): cinco campos de texto, salvos enquanto ela escreve.
export default function SummaryTemplate() {
  const { childId } = useParams();

  return (
    <RecordScreen childId={childId}>
      {({ child, record, setSummary }) => (
        <>
          <section className={styles.top}>
            <p className={styles.student}>
              {child.name} · {formatLongDate()}
            </p>
            <h1 className={styles.title}>Resumo do dia</h1>
          </section>

          {SUMMARY_FIELDS.map((field) => (
            <div key={field.key} className={styles.field}>
              <label className={styles.label} htmlFor={`summary-${field.key}`}>
                {field.label}
              </label>
              <textarea
                id={`summary-${field.key}`}
                className={styles.textarea}
                rows={field.key === 'family' ? 5 : 3}
                value={record.summary[field.key] ?? ''}
                onChange={(event) => setSummary(field.key, event.target.value)}
              />
            </div>
          ))}
        </>
      )}
    </RecordScreen>
  );
}
